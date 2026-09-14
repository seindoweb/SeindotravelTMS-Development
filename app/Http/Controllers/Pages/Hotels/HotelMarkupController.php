<?php

namespace App\Http\Controllers\Pages\Hotels;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HotelMarkupController extends Controller
{

    /**
     * indexByHotel
     *
     * @return void
     */
    public function indexByHotel()
    {
        return Inertia::render('Hotel/Markups/IndexByHotel/index');
    }

    /**
     * indexByDestination
     *
     * @return void
     */
    public function indexByDestination()
    {
        return Inertia::render('Hotel/Markups/IndexByDestination/Index');
    }
}
