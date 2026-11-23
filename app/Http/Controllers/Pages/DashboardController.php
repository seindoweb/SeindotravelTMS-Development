<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\SupplierBalance;
use App\Models\User;
use Carbon\Carbon;
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

    /**
     * retrieveSupbal
     *
     * @return void
     */
    public function retrieveSupbal()
    {
        $supplierBalance = SupplierBalance::query()
            ->where('is_active', true)
            ->with(['supplier'])
            ->get();

        return response()->json($supplierBalance);
    }

    public function retrieveActus()
    {
        $currentUsers = User::whereBetween('last_active_at', [
            now()->startOfMonth(),
            now(),
        ])->count();

        $previousUsers = User::whereBetween('last_active_at', [
            now()->subMonth()->startOfMonth(),
            now()->subMonth()->endOfMonth(),
        ])->count();

        $growth = $previousUsers > 0
            ? (($currentUsers - $previousUsers) / $previousUsers) * 100
            : 0;

        $response = [
            'value' => $currentUsers,
            'change' => round($growth, 1),
            'positive' => $growth >= 0,
        ];

        return response()->json($response);
    }
}
