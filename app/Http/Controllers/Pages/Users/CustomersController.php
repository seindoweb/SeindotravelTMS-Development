<?php

namespace App\Http\Controllers\Pages\Users;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
     * @param  mixed $request
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
            ->orderBy("full_name", "asc")
            ->paginate(10)
            ->withQueryString();
        return response()->json($customers);
    }
}
