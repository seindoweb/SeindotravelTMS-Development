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
}
