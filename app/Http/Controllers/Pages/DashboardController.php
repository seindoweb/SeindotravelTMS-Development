<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * index
     *
     * @return void
     */
    public function index()
    {
        return Inertia::render('Dashboard/Index');
    }

    /**
     * retrieveLarecu
     *
     * @return void
     */
    public function retrieveLarecu()
    {
        $customers = User::query()
            ->with(['upline', 'userCredits'])
            ->orderBy('id', 'desc')
            ->limit(4)
            ->get();

        return response()->json($customers);
    }
}
