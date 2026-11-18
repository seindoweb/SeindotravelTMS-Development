<?php

namespace App\Http\Controllers\Pages\Finances;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FlightsViaController extends Controller
{
    /**
     * index
     *
     * @return void
     */
    public function index()
    {
        return Inertia::render('Finance/Flights/Via/Index');
    }
}
