<?php

namespace App\Http\Controllers\Pages\Hotels;

use App\Constants\ModelConstant;
use App\Constants\SystemConstant;
use App\Events\MonitoringHotelProductAttributeOrderEvent;
use App\Events\PaymentActivityEvent;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderProductAttribute;
use App\Services\HotelMicroserviceApi\BookingPreview;
use App\Services\HotelMicroserviceApi\ReservationDetails;
use App\Services\Systems\SupplierBalanceService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\LaravelPdf\Facades\Pdf;

class HotelOrderController extends Controller
{
    /**
     * orderList
     *
     * @return void
     */
    public function orderList(Request $request)
    {
        $search = $request->query('search');

        $orders = Order::query()
            ->whereHas('orderProductAttributes', function ($query) {
                $query->where('product_attribute_id', 1);
            })
            ->with([
                'user:id,full_name,email',
                'creator:id,full_name',
                'orderProductAttributes' => function ($query) {
                    $query->where('product_attribute_id', 1)->with('hotelBooking');
                },
            ])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('invoice_number', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($uq) use ($search) {
                            $uq->where('full_name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        })
                        ->orWhereHas('orderProductAttributes', function ($opq) use ($search) {
                            $opq->where('product_attribute_id', 1)
                                ->where('code', 'like', "%{$search}%");
                        });
                });
            })
            ->latest('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Hotel/Orders/List', [
            'orders' => $orders,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * orderDetails
     *
     * @return Response
     */
    public function orderDetails(string $code)
    {
        $rawCode = helperReplaceSeparator($code, '-', '/');

        $orderProductAttribute = OrderProductAttribute::query()
            ->where('code', $rawCode)
            ->with([
                'order.user',
                'order.creator',
                'hotelBooking.hotelBookingRoomDetails',
                'hotelBooking.hotelBookingRooms.hotelBookingRoomPaxes',
                'hotelBooking.hotelBookingDetails',
            ])
            ->firstOrFail();

        $hotelBooking = $orderProductAttribute->hotelBooking;
        $hotelPreview = null;

        if ($hotelBooking && $hotelBooking->session_id) {
            try {
                $hotelPreview = BookingPreview::getBookingPreview($hotelBooking->session_id);
            } catch (\Throwable $e) {
                // Sesi kedaluwarsa atau error koneksi microservice
            }
        }

        return Inertia::render('Hotel/Orders/Details', [
            'orderProductAttribute' => $orderProductAttribute,
            'hotelPreview' => $hotelPreview,
        ]);
    }

    /**
     * orderIssued
     *
     * @param string $code
     * @return void
     */
    public function orderIssued(string $code)
    {
        $rawCode = helperReplaceSeparator($code, '-', '/');
        $orderAtt = OrderProductAttribute::query()->where('code', $rawCode)->first();
        if ($orderAtt && $orderAtt->order) {
            if (!SupplierBalanceService::hasSufficientBalance($orderAtt)) {

                return redirect()
                    ->route('hotel.orders.orderDetails', $code)
                    ->with('error', 'Insufficient supplier balance to process this booking.');
            }

            $orderAtt->order->payment_status = ModelConstant::PAYMENT_STATUS_PAID;

            if ($orderAtt->order->save()) {
                PaymentActivityEvent::dispatch($orderAtt->order, $orderAtt->order->payment_status, SystemConstant::SYSTEM_PLATFORMS_TMS);
                MonitoringHotelProductAttributeOrderEvent::dispatch($orderAtt);
            }
        }

        return redirect()->back();
    }

    /**
     * orderBookReference
     *
     * @param string $code
     * @return void
     */
    public function orderBookReference(string $code)
    {
        $rawCode = helperReplaceSeparator($code, '-', '/');

        $orderAtt = OrderProductAttribute::query()->where('code', $rawCode)->firstOrFail();

        $allowedStatuses = [
            ModelConstant::ORDER_STATUS_CONFIRMED,
            ModelConstant::ORDER_STATUS_DONE,
        ];

        if (! in_array($orderAtt->order_status, $allowedStatuses)) {
            return response()->json([
                'message' => 'Book reference is only available for Confirmed or Done orders.',
            ], 403);
        }

        $reqHttp = [
            'providerBookingID' => $orderAtt->reference_id ?: null,
            'agencyBookingID' => $rawCode,
        ];

        try {
            $data = ReservationDetails::getReservationDetails($reqHttp);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to fetch reservation details from supplier.',
                'error' => $e->getMessage(),
            ], 502);
        }

        return response()->json($data);
    }

    /**
     * orderDataPdf
     *
     * @param string $code
     * @return array
     */
    public function orderDataPdf(string $code): array
    {
        $rawCode = helperReplaceSeparator($code, '-', '/');

        $orderAtt = OrderProductAttribute::query()->where('code', $rawCode)->firstOrFail();
        $content = [
            'logo' => asset('assets/images/logo.png')
        ];

        $customer = [
            'full_name' => $orderAtt?->order?->user?->full_name
        ];

        $order = [
            'code' => $orderAtt->code
        ];

        $hotel = [];

        $data = [
            'content' => $content,
            'customer' => $customer,
            'order' => $order,
            'hotel' => $hotel
        ];

        return $data;
    }
    public function orderDownloadPdf(string $code)
    {
        $data = $this->orderDataPdf($code);

        return Pdf::view('pdfs.hotel-e-voucher', [
            'data' => $data,
        ])
            ->format('a4')
            ->name("e-voucher-({$data['customer']['full_name']})-{$data['order']['code']}.pdf");
    }
    public function orderPreviewPdf(string $code)
    {
        $data = $this->orderDataPdf($code);

        return view('pdfs.hotel-e-voucher', compact('data'));
    }
}
