<?php

namespace App\Http\Controllers\Pages\Users;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Systems\TriadIdMask;
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
     * retrieveData
     *
     * @param  mixed  $request
     * @return void
     */
    public function retrieveData(Request $request)
    {
        $search = $request->search;
        $customers = User::query()
            ->when($search, function ($q) use ($search) {
                $q->where(function ($qq) use ($search) {
                    $qq->where('full_name', 'like', "%{$search}%");
                });
            })
            ->orderBy('full_name', 'asc')
            ->paginate(10)
            ->withQueryString();

        return response()->json($customers);
    }

    /**
     * show
     *
     * @param  string  $tracking_code  
     */
    public function show(string $tracking_code): Response
    {
        $customer = User::with(['countries', 'states', 'cities'])
            ->where('tracking_code', $tracking_code)
            ->firstOrFail();

        return Inertia::render('User/Customers/Show', [
            'customer' => $customer,
        ]);
    }
}
