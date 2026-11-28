<?php

namespace App\Http\Controllers\Pages\Flights;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FlightOrderController extends Controller
{
    /**
     * index
     *
     * @return void
     */
    public function index(Request $request)
    {
        return Inertia::render('Flight/Orders/Index', []);
    }
}
