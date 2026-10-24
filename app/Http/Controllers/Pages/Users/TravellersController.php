<?php

namespace App\Http\Controllers\Pages\Users;

use App\Http\Controllers\Controller;
use App\Models\Traveller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TravellersController extends Controller
{
    /**
     * index
     *
     * @return void
     */
    public function index()
    {
        return Inertia::render('User/Travellers/Index');
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
        $travellers = Traveller::query()
            ->when($search, function ($q) use ($search) {
                $q->where(function ($qq) use ($search) {
                    $qq->where('first_name', 'like', "%{$search}%");
                    $qq->orWhere('last_name', 'like', "%{$search}%");
                });
            })
            ->orderBy('id', 'asc')
            ->paginate(10)
            ->withQueryString();

        return response()->json($travellers);
    }
}
