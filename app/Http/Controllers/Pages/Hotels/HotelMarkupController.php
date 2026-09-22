<?php

namespace App\Http\Controllers\Pages\Hotels;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class HotelMarkupController extends Controller
{
    /**
     * indexByHotel
     *
     * @return void
     */
    public function indexByHotel()
    {
        return Inertia::render('Hotel/Markups/IndexByHotel/index');
    }

    /**
     * indexByDestination
     *
     * @return void
     */
    public function indexByDestination()
    {
        return Inertia::render('Hotel/Markups/IndexByDestination/Index');
    }

    /**
     * createHotel
     *
     * @return void
     */
    public function createHotel()
    {
        return Inertia::render('Hotel/Markups/IndexByHotel/Create');
    }

    /**
     * createDestination
     *
     * @return void
     */
    public function createDestination()
    {
        return Inertia::render('Hotel/Markups/IndexByDestination/Create');
    }

    /**
     * editHotel
     *
     * @param  int|string  $id
     * @return void
     */
    public function editHotel($id)
    {
        return Inertia::render('Hotel/Markups/IndexByHotel/Edit', [
            'markupKey' => (int) $id,
        ]);
    }

    /**
     * editDestination
     *
     * @param  int|string  $id
     * @return void
     */
    public function editDestination($id)
    {
        return Inertia::render('Hotel/Markups/IndexByDestination/Edit', [
            'markupKey' => (int) $id,
        ]);
    }
}
