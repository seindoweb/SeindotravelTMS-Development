<?php

use App\Http\Controllers\Api2026\AuthController as V2026AuthController;
use App\Http\Controllers\Api2026\ProfileController as V2026ProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('api.client')->prefix('v2026')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('login', [V2026AuthController::class, 'login']);
        Route::post('register', [V2026AuthController::class, 'register']);
        Route::post('logout', [V2026AuthController::class, 'logout'])->middleware('auth:sanctum');
    });
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::prefix('/customer')->group(function () {
            Route::post('/fetch-profile', [V2026ProfileController::class, 'fetchProfile']);
            Route::post('/update-identity', [V2026ProfileController::class, 'updateIdentity']);
            Route::post('/update-address', [V2026ProfileController::class, 'updateAddress']);
            Route::post('/change-password', [V2026ProfileController::class, 'changePassword']);
            Route::post('/change-currency', [V2026ProfileController::class, 'changeCurrency']);
            Route::post('/change-locale', [V2026ProfileController::class, 'changeLocale']);
        });
    });
});
