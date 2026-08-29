<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::post('/locale', function () {
    $locale = request('locale', 'en');

    if (!in_array($locale, ['en', 'id'])) {
        $locale = 'en';
    }

    session(['locale' => $locale]);
    app()->setLocale($locale);

    if (Auth::check()) {
        $user = Auth::user();

        $user->locale = $locale;
        $user->save();
    }

    return back();
})->name('locale.set');
