<?php

namespace App\Http\Controllers\Pages\Users;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomersController extends Controller
{
    /**
     * index
     *
     * @return void
     */
    public function index()
    {
        return Inertia::render('User/Customers/Index');
    }

    /**
     * dataList
     *
     * @param  mixed  $request
     * @return void
     */
    public function dataList(Request $request)
    {
        $search = $request->search;
        $customers = User::query()
            ->when($search, function ($q) use ($search) {
                $q->where(function ($qq) use ($search) {
                    $qq->where('full_name', 'like', "%{$search}%");
                });
            })
            ->with(['upline', 'userCredits'])
            ->orderBy('id', 'asc')
            ->paginate(10)
            ->withQueryString();

        return response()->json($customers);
    }

    /**
     * show
     */
    public function show(string $tracking_code): Response
    {
        return Inertia::render('User/Customers/Show', [
            'tracking_code' => $tracking_code,
        ]);
    }

    /**
     * dataDetails
     */
    public function dataDetails(Request $request)
    {
        $trackingCode = $request->input('tracking_code');

        $customer = User::with(['countries', 'states', 'cities', 'upline', 'userCredits'])
            ->where('tracking_code', $trackingCode)
            ->first();

        return response()->json($customer);
    }
}
