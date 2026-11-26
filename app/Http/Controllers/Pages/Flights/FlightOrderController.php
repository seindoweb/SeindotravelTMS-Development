<?php

namespace App\Http\Controllers\Pages\Flights;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FlightOrderController extends Controller
{
    /**
     * orderList
     *
     * @return void
     */
    public function orderList(Request $request)
    {
        return Inertia::render('Flight/Orders/List', []);
    }
}
