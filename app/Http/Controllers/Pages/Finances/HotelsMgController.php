<?php

namespace App\Http\Controllers\Pages\Finances;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HotelsMgController extends Controller
{
    /**
     * index
     *
     * @return void
     */
    public function index()
    {
        return Inertia::render('Finance/Hotels/Mg/Index');
    }
}
