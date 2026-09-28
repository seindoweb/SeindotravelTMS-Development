<?php

namespace App\Http\Controllers\Pages\Hotels;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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
     * @param Request $request
     * @return void
     * only 1 room
     * link: ?type="dst"&country=ID&code=ID-CGK&checkIn=2026-10-13&checkOut=2026-10-14&room=1-1-0-0-0-false&page=1
     * more 1 room
     * link: ?type="dst"&country=ID&code=ID-CGK&checkIn=2026-10-13&checkOut=2026-10-14&room=1-1-0-0-0-false,2-2-1-2-0-false&page=1
     */
    public function search(Request $request)
    {
        return Inertia::render('Hotel/Bookings/SearchDst');
    }
}
