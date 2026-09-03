<?php

namespace App\Http\Controllers\Pages\Hotels;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HotelOrderController extends Controller
{
    /**
     * orderList
     *
     * @return void
     */
    public function orderList()
    {
        return Inertia::render('Hotel/Orders/List');
    }

    /**
     * orderDetails
     *
     * @return void
     */
    public function orderDetails() {}
}
