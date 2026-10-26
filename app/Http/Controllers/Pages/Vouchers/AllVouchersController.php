<?php

namespace App\Http\Controllers\Pages\Vouchers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AllVouchersController extends Controller
{
    /**
     * indexFlight
     *
     * @return void
     */
    public function indexFlight()
    {
        return $this->index('flight', 'Flight Vouchers');
    }

    /**
     * indexHotel
     *
     * @return void
     */
    public function indexHotel()
    {
        return $this->index('hotel', 'Hotel Vouchers');
    }

    /**
     * indexTour
     *
     * @return void
     */
    public function indexTour()
    {
        return $this->index('tour', 'Tour Vouchers');
    }

    /**
     * index
     *
     * @return void
     */
    public function index(string $product_attribute, string $title)
    {
        return Inertia::render('Voucher/AllVouchers/Index', [
            'product_attribute' => $product_attribute,
            'title' => $title
        ]);
    }
}
