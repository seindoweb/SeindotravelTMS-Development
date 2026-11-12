<?php

namespace App\Http\Controllers\Pages\Hotels;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderProductAttribute;
use App\Services\HotelMicroserviceApi\BookingPreview;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

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
        $fixedCode = str_replace('/SGT/', '-SGT/', $rawCode);

        $orderProductAttribute = OrderProductAttribute::query()
            ->where(function ($query) use ($code, $rawCode, $fixedCode) {
                $query->whereIn('code', [$code, $rawCode, $fixedCode])
                    ->orWhereHas('order', function ($oq) use ($code) {
                        $oq->where('invoice_number', $code);
                    });
            })
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

    public function orderIssued(string $code)
    {
        dd('OK!!!!!!!!!!', [
            'order_code' => $code,
            'payload' => request()->all(),
        ]);
    }
}
