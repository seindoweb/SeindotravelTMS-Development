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
     * Destinasi
     * link: ?type="dst"&country=ID&destination=ID-CGK&checkIn=2026-10-13&checkOut=2026-10-14&room=1-1-0-0-0-false&page=1
     * Hotel
     * link: ?type="dst"&country=ID&destination=ID-CGK&hotel=ID10009800&checkIn=2026-10-13&checkOut=2026-10-14&room=1-1-0-0-0-false&page=1
     *
     * more 1 room
     * Destinasi
     * link: ?type="dst"&country=ID&destination=ID-CGK&checkIn=2026-10-13&checkOut=2026-10-14&room=1-1-0-0-0-false,2-2-1-2-0-false&page=1
     * Hotel
     * link: ?type="dst"&country=ID&destination=ID-CGK&hotel=ID10009800&checkIn=2026-10-13&checkOut=2026-10-14&room=1-1-0-0-0-false,2-2-1-2-0-false&page=1
     */
    public function search(Request $request)
    {
        $params = [
            'type' => $request->query('type', 'dst'),
            'country' => $request->query('country', ''),
            'code' => $request->query('code', ''),
            'checkIn' => $request->query('checkIn', ''),
            'checkOut' => $request->query('checkOut', ''),
            'room' => $request->query('room', ''),
            'page' => (int) $request->query('page', 1),
        ];

        $type = $params['type'];

        if ($type === 'htl') {
            return Inertia::render('Hotel/Bookings/SearchHtl', $params);
        } else if ($type === 'dst') {
            return Inertia::render('Hotel/Bookings/SearchDst', $params);
        } else {
            return Inertia::render('Hotel/Bookings/Index');
        }
    }
}
