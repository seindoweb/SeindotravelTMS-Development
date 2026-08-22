<?php

use App\Http\Controllers\Api2026\AuthController as V2026AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('api.client')->prefix('v2026')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('login', [V2026AuthController::class, 'login']);
        Route::post('register', [V2026AuthController::class, 'register']);
    });
    Route::middleware(['auth:sanctum'])->group(function () {});
});
