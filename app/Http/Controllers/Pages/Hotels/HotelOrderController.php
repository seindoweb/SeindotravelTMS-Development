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
use Carbon\Carbon;
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
     * @return void
     */
    public function orderIssued(string $code)
    {
        $rawCode = helperReplaceSeparator($code, '-', '/');
        $orderAtt = OrderProductAttribute::query()->where('code', $rawCode)->first();
        if ($orderAtt && $orderAtt->order) {
            if (! SupplierBalanceService::hasSufficientBalance($orderAtt)) {

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
     */
    public function orderDataPdf(string $code): array
    {
        $rawCode = helperReplaceSeparator($code, '-', '/');

        $orderAtt = OrderProductAttribute::query()
            ->where('code', $rawCode)
            ->with([
                'order.user',
                'order.creator',
                'hotelBooking.hotelBookingRoomDetails',
                'hotelBooking.hotelBookingRooms.hotelBookingRoomPaxes',
                'hotelBooking.hotelBookingDetails',
            ])
            ->firstOrFail();

        $order = $orderAtt->order;
        $customer = $order?->user;
        $hotelBooking = $orderAtt->hotelBooking;
        $roomDetails = $hotelBooking?->hotelBookingRoomDetails ?? collect();
        $rooms = $hotelBooking?->hotelBookingRooms ?? collect();
        $hotelDetails = $hotelBooking?->hotelBookingDetails;

        // Fallback or optional preview
        $hotelPreview = null;
        if ($hotelBooking && $hotelBooking->session_id) {
            try {
                $hotelPreview = BookingPreview::getBookingPreview($hotelBooking->session_id);
            } catch (\Throwable $e) {
                // Silently fallback to cached DB data
            }
        }

        $previewResults = $hotelPreview['results'] ?? null;

        // Check-in & Check-out calculations
        $checkInRaw = $hotelBooking?->check_in;
        $checkOutRaw = $hotelBooking?->check_out;
        $checkIn = $checkInRaw ? Carbon::parse($checkInRaw) : null;
        $checkOut = $checkOutRaw ? Carbon::parse($checkOutRaw) : null;
        $nights = ($checkIn && $checkOut) ? max(1, (int) $checkIn->diffInDays($checkOut)) : 1;

        // Room and Pax processing
        $firstRoomDetail = $roomDetails->first();
        $roomTypeName = $firstRoomDetail?->name ?? 'Standard Room';
        $mealPlanName = $firstRoomDetail?->meal_plan_name ?? $firstRoomDetail?->meal_plan_code ?? 'Room Only';
        $cancellationPolicy = $firstRoomDetail?->cancellation_policy_type ?? 'Standard Policy';

        $roomList = [];
        $totalAdults = 0;
        $totalChildren = 0;
        $allPaxes = [];

        foreach ($rooms as $index => $room) {
            $roomNo = $room->room_no ?? ($index + 1);
            $adults = (int) ($room->no_of_adults ?? 1);
            $childs = (int) ($room->no_of_child ?? 0);
            $totalAdults += $adults;
            $totalChildren += $childs;

            $roomPaxes = [];
            foreach ($room->hotelBookingRoomPaxes ?? [] as $paxIndex => $pax) {
                $salutation = trim($pax->salutation ?? '');
                $paxData = [
                    'salutation' => $salutation,
                    'first_name' => $pax->first_name ?? '',
                    'last_name' => $pax->last_name ?? '',
                    'full_name' => trim(($salutation ? $salutation.' ' : '').($pax->first_name ?? '').' '.($pax->last_name ?? '')),
                    'age' => $pax->age ?? null,
                    'is_lead' => ($index === 0 && $paxIndex === 0),
                ];
                $roomPaxes[] = $paxData;
                $allPaxes[] = $paxData;
            }

            $roomList[] = [
                'room_no' => $roomNo,
                'adults' => $adults,
                'children' => $childs,
                'name' => $firstRoomDetail?->name ?? 'Standard Room',
                'meal_plan' => $mealPlanName,
                'cancellation_policy' => $cancellationPolicy,
                'rate_key' => $room->rate_key ?? null,
                'paxes' => $roomPaxes,
            ];
        }

        $leadGuest = $allPaxes[0]['full_name'] ?? ($customer?->full_name ?? 'Guest Customer');

        // Address resolution
        $hotelName = $previewResults['name'] ?? ($hotelDetails?->name ?? ($hotelBooking?->hotel ?? 'Hotel Booking'));
        $hotelRating = $hotelDetails?->rating ?? ($previewResults['starRating'] ?? '4');
        $hotelAddress = $previewResults['locations']['addressMain'] ?? ($hotelDetails?->address_main ?? ($hotelBooking?->destination ?? 'Indonesia'));
        $hotelCity = $hotelDetails?->destination_name ?? ($previewResults['locations']['cityName'] ?? '');
        $hotelCountry = $hotelDetails?->country_name ?? ($previewResults['locations']['countryName'] ?? 'Indonesia');
        $hotelPhone = $previewResults['phone'] ?? ($customer?->phone_number ?? '+62 812-1010-3588');

        // Logo
        $logoPath = public_path('assets/images/logo.png');
        $logoBase64 = file_exists($logoPath)
            ? 'data:image/png;base64,'.base64_encode(file_get_contents($logoPath))
            : asset('assets/images/logo.png');

        $paymentMethod = match ($order?->type_of_payment) {
            'CH' => 'Cash',
            'TF' => 'Bank Transfer',
            'PG' => 'Online Payment',
            'UC' => 'User Credit',
            default => $order?->type_of_payment ?? 'Direct Payment',
        };

        $statusInitial = strtoupper($orderAtt->order_status ?? 'B');
        $statusConfigMap = [
            'B' => ['label' => 'BOOKING', 'text' => '#B45309', 'bg' => '#FEF3C7', 'border' => '#FDE68A', 'dot' => '#F59E0B'],
            'P' => ['label' => 'PROGRESS', 'text' => '#0369A1', 'bg' => '#E0F2FE', 'border' => '#BAE6FD', 'dot' => '#0EA5E9'],
            'C' => ['label' => 'CONFIRMED', 'text' => '#1D4ED8', 'bg' => '#DBEAFE', 'border' => '#BFDBFE', 'dot' => '#3B82F6'],
            'D' => ['label' => 'ISSUED', 'text' => '#065F46', 'bg' => '#D1FAE5', 'border' => '#A7F3D0', 'dot' => '#10B981'],
            'A' => ['label' => 'ABORTED', 'text' => '#6D28D9', 'bg' => '#EDE9FE', 'border' => '#DDD6FE', 'dot' => '#8B5CF6'],
            'F' => ['label' => 'FAILED', 'text' => '#991B1B', 'bg' => '#FEE2E2', 'border' => '#FECDD3', 'dot' => '#EF4444'],
            'E' => ['label' => 'EXPIRED', 'text' => '#334155', 'bg' => '#F1F5F9', 'border' => '#CBD5E1', 'dot' => '#64748B'],
            'X' => ['label' => 'CANCELLED', 'text' => '#9F1239', 'bg' => '#FFE4E6', 'border' => '#FECACA', 'dot' => '#F43F5E'],
        ];
        $statusConfig = $statusConfigMap[$statusInitial] ?? $statusConfigMap['B'];

        $rawPaymentStatus = strtolower($order?->payment_status ?? 'unpaid');
        $paymentConfigMap = [
            'paid' => ['label' => 'PAID', 'text' => '#065F46', 'bg' => '#ECFDF5', 'border' => '#A7F3D0'],
            'unpaid' => ['label' => 'UNPAID', 'text' => '#B45309', 'bg' => '#FFFBEB', 'border' => '#FDE68A'],
            'pending' => ['label' => 'PENDING', 'text' => '#B45309', 'bg' => '#FFFBEB', 'border' => '#FDE68A'],
            'partially' => ['label' => 'PARTIALLY', 'text' => '#6D28D9', 'bg' => '#EDE9FE', 'border' => '#DDD6FE'],
            'expired' => ['label' => 'EXPIRED', 'text' => '#334155', 'bg' => '#F1F5F9', 'border' => '#CBD5E1'],
            'failed' => ['label' => 'FAILED', 'text' => '#991B1B', 'bg' => '#FEE2E2', 'border' => '#FECDD3'],
        ];
        $paymentMeta = $paymentConfigMap[$rawPaymentStatus] ?? $paymentConfigMap['unpaid'];

        return [
            'company' => [
                'name' => 'Seindo Travel',
                'legal_name' => 'PT. Seindo Global Tour',
                'tagline' => 'Travel Management System',
                'address' => 'Komplek Cemara Asri, Jl. Boulevard Timur No.28 AI-AJ Medan Estate, Percut Sei Tuan, Deli Serdang, Sumatera Utara 20371',
                'phone' => '+62 812-1010-3588',
                'email' => 'sales@seindotravel.com',
                'website' => 'www.seindotravel.com',
                'logo' => $logoBase64,
                'logo_url' => asset('assets/images/logo.png'),
            ],
            'order' => [
                'id' => $order?->id,
                'code' => $orderAtt->code,
                'safe_code' => helperReplaceSeparator($orderAtt->code, '/', '-'),
                'invoice_number' => $order?->invoice_number ?? '-',
                'status' => $statusInitial,
                'status_label' => $statusConfig['label'],
                'status_color' => $statusConfig['text'],
                'status_bg' => $statusConfig['bg'],
                'status_border' => $statusConfig['border'],
                'status_dot' => $statusConfig['dot'],
                'booking_status' => $hotelBooking?->booking_status ?? $orderAtt->order_status,
                'reference_id' => $orderAtt->reference_id, // MG Booking ID
                'supplier_source' => $orderAtt->supplier_source ?? 'MG',
                'payment_status' => $paymentMeta['label'],
                'payment_status_raw' => $rawPaymentStatus,
                'payment_status_color' => $paymentMeta['text'],
                'payment_status_bg' => $paymentMeta['bg'],
                'payment_status_border' => $paymentMeta['border'],
                'payment_method' => $paymentMethod,
                'created_at' => $orderAtt->created_at ? Carbon::parse($orderAtt->created_at)->translatedFormat('d M Y, H:i') : '-',
                'issued_at' => $orderAtt->updated_at ? Carbon::parse($orderAtt->updated_at)->translatedFormat('d M Y, H:i') : '-',
            ],
            'customer' => [
                'full_name' => $customer?->full_name ?? 'Guest Customer',
                'email' => $customer?->email ?? '-',
                'phone' => trim(($customer?->dial_code ?? '+62').' '.($customer?->phone_number ?? '-')),
                'lead_guest' => $leadGuest,
            ],
            'hotel' => [
                'name' => $hotelName,
                'code' => $hotelDetails?->code ?? $hotelBooking?->hotel ?? '-',
                'rating' => min(5, max(1, (int) round((float) $hotelRating))),
                'raw_rating' => $hotelRating,
                'address' => $hotelAddress,
                'city' => $hotelCity,
                'country' => $hotelCountry,
                'phone' => $hotelPhone,
                'check_in' => $checkIn ? $checkIn->translatedFormat('d M Y') : '-',
                'check_in_full' => $checkIn ? $checkIn->translatedFormat('l, d F Y') : '-',
                'check_in_time' => '14:00',
                'check_out' => $checkOut ? $checkOut->translatedFormat('d M Y') : '-',
                'check_out_full' => $checkOut ? $checkOut->translatedFormat('l, d F Y') : '-',
                'check_out_time' => '12:00',
                'nights' => $nights,
                'room_type' => $roomTypeName,
                'meal_plan' => $mealPlanName,
                'cancellation_policy' => $cancellationPolicy,
                'total_rooms' => $rooms->count() ?: 1,
                'total_guests' => max(1, $totalAdults + $totalChildren),
                'total_adults' => $totalAdults ?: 1,
                'total_children' => $totalChildren,
                'special_requests' => $hotelBooking?->special_requests ?: 'Tidak ada permintaan khusus.',
            ],
            'rooms' => $roomList,
            'paxes' => $allPaxes,
            'pricing' => [
                'currency' => $order?->currency_code ?? 'IDR',
                'subtotal' => (float) ($order?->subtotal_amount ?? 0),
                'discount' => (float) ($order?->discount_amount ?? 0),
                'tax' => (float) ($order?->tax_amount ?? 0),
                'total' => (float) ($order?->total_amount ?? 0),
                'formatted_subtotal' => 'Rp '.number_format((float) ($order?->subtotal_amount ?? 0), 0, ',', '.'),
                'formatted_discount' => 'Rp '.number_format((float) ($order?->discount_amount ?? 0), 0, ',', '.'),
                'formatted_tax' => 'Rp '.number_format((float) ($order?->tax_amount ?? 0), 0, ',', '.'),
                'formatted_total' => 'Rp '.number_format((float) ($order?->total_amount ?? 0), 0, ',', '.'),
            ],
            'terms' => [
                'Tunjukkan E-Voucher ini beserta kartu identitas berfoto resmi (KTP / Paspor) yang masih berlaku saat proses check-in di resepsionis hotel.',
                'Waktu standar check-in mulai pukul 14:00 waktu setempat dan waktu check-out maksimal pukul 12:00 waktu setempat.',
                'Pihak hotel berhak meminta uang deposit jaminan (tunai atau kartu kredit) pada saat check-in untuk keperluan biaya insidental yang dapat dikembalikan saat check-out.',
                'Permintaan khusus (seperti tipe kasur, lantai bebas rokok, connecting room, atau early check-in) tergantung ketersediaan pada saat kedatangan hotel dan tidak dapat dijamin.',
                'Jika Anda memerlukan bantuan mendesak atau mengalami kendala saat check-in di hotel, segera hubungi tim Customer Support Seindo Travel 24/7 di +62 812-1010-3588.',
            ],
        ];
    }

    public function orderDownloadPdf(string $code)
    {
        $data = $this->orderDataPdf($code);
        $filename = "e-voucher-({$data['customer']['full_name']})-{$data['order']['safe_code']}.pdf";

        return Pdf::view('pdfs.hotel-e-voucher', [
            'data' => $data,
            'isPdf' => true,
        ])
            ->format('a4')
            ->name($filename);
    }

    public function orderPreviewPdf(string $code)
    {
        $data = $this->orderDataPdf($code);

        return view('pdfs.hotel-e-voucher', [
            'data' => $data,
            'isPdf' => false,
        ]);
    }
}
