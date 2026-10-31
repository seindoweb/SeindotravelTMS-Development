<?php

namespace App\Http\Controllers\Pages\Hotels;

use App\Constants\ModelConstant;
use App\Constants\SystemConstant;
use App\Enums\PaymentStatus;
use App\Enums\PaymentType;
use App\Services\HotelMicroserviceApi\BookingPreview;
use App\Http\Controllers\Controller;
use App\Models\HotelBooking;
use App\Models\HotelBookingRoom;
use App\Models\HotelBookingRoomDetails;
use App\Models\HotelBookingRoomPax;
use App\Models\Order;
use App\Models\OrderProductAttribute;
use App\Models\ProductAttribute;
use App\Models\User;
use App\Services\Systems\CodeGenerator;
use App\Services\Systems\InvoiceNumber;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HotelBookingController extends Controller
{
    /**
     * index
     *
     * @return void
     */
    public function index()
    {
        return Inertia::render('Hotel/Bookings/Index');
    }

    /**
     * search
     *
     * @return void
     *              only 1 room
     *              Destinasi
     *              link: ?type="dst"&country=ID&destination=ID-CGK&checkIn=2026-10-13&checkOut=2026-10-14&room=1-1-0-0-0-false&page=1
     *              Hotel
     *              link: ?type="dst"&country=ID&destination=ID-CGK&hotel=ID10009800&checkIn=2026-10-13&checkOut=2026-10-14&room=1-1-0-0-0-false&page=1
     *
     * more 1 room
     * Destinasi
     * link: ?type="dst"&country=ID&destination=ID-CGK&checkIn=2026-10-13&checkOut=2026-10-14&room=1-1-0-0-0-false,2-2-1-2-0-false&page=1
     * Hotel
     * link: ?type="dst"&country=ID&destination=ID-CGK&hotel=ID10009800&checkIn=2026-10-13&checkOut=2026-10-14&room=1-1-0-0-0-false,2-2-1-2-0-false&page=1
     */
    public function search(Request $request)
    {
        $rawType = (string) $request->query('type', 'dst');
        $type = trim($rawType, '"\' ');
        $hotel = (string) ($request->query('hotel') ?: $request->query('code', ''));
        $destination = (string) ($request->query('destination') ?: $request->query('destinasi', ''));
        if (empty($destination) && empty($hotel)) {
            $destination = (string) $request->query('code', '');
        }
        $country = (string) $request->query('country', 'ID');
        $checkIn = (string) $request->query('checkIn', '');
        $checkOut = (string) $request->query('checkOut', '');
        $room = (string) $request->query('room', '');
        $page = (int) $request->query('page', 1);

        $params = [
            'type' => $type,
            'country' => $country,
            'destination' => $destination,
            'checkIn' => $checkIn,
            'checkOut' => $checkOut,
            'room' => $room,
            'page' => $page,
        ];

        if (! empty($hotel) || $type === 'htl') {
            $params['hotel'] = $hotel;

            return Inertia::render('Hotel/Bookings/SearchHtl', $params);
        }

        if (! empty($destination) || $type === 'dst') {
            return Inertia::render('Hotel/Bookings/SearchDst', $params);
        }

        return Inertia::render('Hotel/Bookings/Index');
    }

    /**
     * guest
     *
     * @return void
     * only 1 room
     * Guest
     * ?country=ID&destination=ID-CGK&hotel=ID10000117&checkIn=2026-10-13&checkOut=2026-10-14&sessionId=1AF58339-6815-49CB-ACB6-3F720310968A&code=RM_3142_1&mealPlan=BDBF&cancellationPolicyType=Flexi&packageRate=false
     */
    public function guest(Request $request)
    {
        return Inertia::render('Hotel/Bookings/Guest', $request->all());
    }

    /**
     * create
     *
     * @return void
     */
    public function create(string $session_id, string $customer_tracking_code)
    {
        $usr = User::where('tracking_code', $customer_tracking_code)->first();
        $res = BookingPreview::getBookingPreview($session_id);
        $att = ProductAttribute::where('attribute', ModelConstant::PRODUCT_ATTRIBUTE_HOTEL)->first();
        $h_book = HotelBooking::where('session_id', $session_id)->first();

        if ($h_book) {
            return redirect()->route('hotel.orders.orderDetails', helperReplaceSeparator($h_book->orderProductAttribute->code));
        }

        if ($res['results'] != null) {
            DB::transaction(function () use ($att, $res, $usr, &$h_book) {
                $order = new Order();

                $order->user_id = $usr->id;
                $order->voucher_code_id = null;
                $order->base_currency_code = SystemConstant::DEFAULT_CURRENCY;
                $order->subtotal_base_amount = (int) $res['results']['roomDetails']['sellingPrice'];
                $order->discount_base_amount = 0;
                $order->tax_base_amount = 0;
                $order->total_base_amount = (int) $res['results']['roomDetails']['sellingPrice'];
                $order->currency_code = $order->base_currency_code;
                $order->exchange_rate = 1;
                $order->subtotal_amount = $order->subtotal_base_amount;
                $order->discount_amount = $order->discount_base_amount;
                $order->tax_amount = $order->tax_base_amount;
                $order->total_amount = $order->total_base_amount;
                $order->type_of_payment =  ModelConstant::PAYMENT_TYPE_CASH;
                $order->payment_status = ModelConstant::PAYMENT_STATUS_UNPAID;
                $order->payment_url  = null;
                $order->system = SystemConstant::SYSTEM_PLATFORMS_TMS;
                $order->expired_at = Carbon::parse($res['sessionExpiredAt']);
                $order->created_by = Auth::id();
                $order->updated_by = Auth::id();
                if ($order->save()) {
                    $order_product_att = new OrderProductAttribute();

                    $order_product_att->order_id = $order->id;
                    $order_product_att->code = CodeGenerator::orderProductAttribute(ModelConstant::PRODUCT_ATTRIBUTE_HOTEL);
                    $order_product_att->product_attribute_id = $att->id;
                    $order_product_att->order_status  = $att->id;
                    $order_product_att->created_by = Auth::id();
                    $order_product_att->created_by = Auth::id();

                    if ($order_product_att->save()) {
                        $h_book = new HotelBooking();

                        $h_book->order_prod_attr_id = $order_product_att->id;
                        $h_book->session_id = $res['results']['sessionID'];
                        $h_book->booking_status = $res['results']['status'];
                        $h_book->country = $res['results']['locations']['countryCode'];
                        $h_book->destination = $res['results']['locations']['countryCode'];
                        $h_book->hotel = $res['results']['hotelCode'];
                        $h_book->check_in = $res['params']['checkIn'];
                        $h_book->check_out = $res['params']['checkOut'];
                        $h_book->pic_guest_nationality = $res['params']['rooms']['picGuestNationality'];

                        if ($h_book->save()) {
                            $roomDet = new HotelBookingRoomDetails();

                            $roomDet->hotel_booking_id = $h_book->id;
                            $roomDet->code = $res['results']['roomDetails']['code'];
                            $roomDet->name = $res['results']['roomDetails']['name'];
                            $roomDet->meal_plan_code = $res['results']['roomDetails']['mealPlanCode'];
                            $roomDet->meal_plan_name = $res['results']['roomDetails']['mealPlanName'];
                            $roomDet->cancellation_policy_type = $res['results']['roomDetails']['cancellationPolicyType'];
                            $roomDet->package_rate = $res['results']['roomDetails']['packageRate'];
                            $roomDet->msp = $res['results']['roomDetails']['msp'] == "" ? 0 : (int) $res['results']['roomDetails']['msp'];
                            $roomDet->gross_price = (int) $res['results']['roomDetails']['grossPrice'];
                            $roomDet->nta_price = (int) $res['results']['roomDetails']['ntaPrice'];
                            $roomDet->nta_price_per_night = (int) $res['results']['roomDetails']['ntaPricePerNight'];
                            $roomDet->markup_price = (int) $res['results']['roomDetails']['markupPrice'];
                            $roomDet->markup_price_per_night = (int) $res['results']['roomDetails']['markupPricePerNight'];
                            $roomDet->selling_price = (int) $res['results']['roomDetails']['sellingPrice'];
                            $roomDet->selling_price_per_night = (int) $res['results']['roomDetails']['sellingPricePerNight'];
                            $roomDet->message = $res['params']['specialRequest'];

                            if ($roomDet->save()) {
                                foreach ($res['results']['roomDetails']['rooms']['room'] ?: [] as $rr) {
                                    $room = new HotelBookingRoom();

                                    $room->hotel_booking_id = $h_book->id;
                                    $room->room_no = $rr['roomNo'];
                                    $room->no_of_adults = $rr['noOfAdults'];
                                    $room->no_of_child = $rr['noOfChild'];
                                    $room->child1_age = $rr['child1Age'];
                                    $room->child2_age = $rr['child2Age'];
                                    $room->extra_bed = $rr['extraBed'];
                                    $room->rate_key = $rr['rateKey'];
                                    if ($room->save()) {
                                        foreach ($res['params']['rooms']['room'] ?: [] as $rp) {
                                            if ($rr['roomNo'] == $rp['roomNo']) {
                                                foreach ($rp['pax'] ?: [] as $p) {
                                                    $roomPax = new HotelBookingRoomPax();

                                                    $roomPax->hotel_booking_room_id = $room->id;
                                                    $roomPax->salutation = $p['salutation'];
                                                    $roomPax->first_name = $p['firstName'];
                                                    $roomPax->last_name = $p['lastName'];
                                                    $roomPax->age = $p['age'];

                                                    $roomPax->save();
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        // dd($order_product_att);
                    }
                }
            });
        }
        return redirect()->route('hotel.orders.orderDetails', helperReplaceSeparator($h_book->orderProductAttribute->code));
    }
}
