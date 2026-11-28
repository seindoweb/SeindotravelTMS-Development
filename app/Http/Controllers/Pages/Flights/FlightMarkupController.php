<?php

namespace App\Http\Controllers\Pages\Flights;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FlightMarkupController extends Controller
{
    /**
     * indexByAirline
     *
     * @return void
     */
    public function indexByAirline()
    {
        return Inertia::render('Flight/Markups/IndexByAirline/index');
    }

    /**
     * indexByAirport
     *
     * @return void
     */
    public function indexByAirport()
    {
        return Inertia::render('Flight/Markups/IndexByAirport/Index');
    }
}
