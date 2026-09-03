<?php

use App\Http\Controllers\Pages\DashboardController;
use App\Http\Controllers\Pages\Hotels\HotelBookingController;
use App\Http\Controllers\Pages\Hotels\HotelOrderController;
use App\Http\Controllers\Pages\Users\AdministratorsController;
use App\Http\Controllers\Pages\Users\CustomersController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (app()->environment('production')) {
        return response('', 403);
    }

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified', 'has.role'])->group(function () {
    // Route::get('/dashboard', function () {

    // })->middleware(['auth',])->name('dashboard');

    Route::prefix('dashboard')->name('dashboard.')->group(function () {
        Route::match(['get', 'post'], '/', [DashboardController::class, 'index'])->name('index');
    });

    Route::prefix('sales')->name('sales.')->group(function () {
        Route::match(['get', 'post'], '/', [DashboardController::class, 'index'])->name('index');
    });

    Route::prefix('events')->name('events.')->group(function () {
        Route::match(['get', 'post'], '/', [DashboardController::class, 'index'])->name('index');
    });

    Route::prefix('hotel')->name('hotel.')->group(function () {
        Route::prefix('orders')->name('orders.')->group(function () {
            Route::match(['get', 'post'], '/list', [HotelOrderController::class, 'orderList'])->name('list');
            Route::match(['get', 'post'], '/details', [HotelOrderController::class, 'orderDetails'])->name('orderDetails');
        });

        Route::prefix('bookings')->name('bookings.')->group(function () {
            Route::match(['get', 'post'], '/', [HotelBookingController::class, 'index'])->name('index');
        });
    });

    Route::prefix('flights')->name('flights.')->group(function () {
        Route::match(['get', 'post'], '/', [DashboardController::class, 'index'])->name('index');
    });

    Route::prefix('tours')->name('tours.')->group(function () {
        Route::match(['get', 'post'], '/', [DashboardController::class, 'index'])->name('index');
    });

    Route::prefix('user')->name('user.')->group(function () {
        Route::prefix('administrators')->name('administrators.')->group(function () {
            Route::match(['get', 'post'], '/', [AdministratorsController::class, 'index'])->name('index');
        });
        Route::prefix('customers')->name('customers.')->group(function () {
            Route::match(['get', 'post'], '/', [CustomersController::class, 'index'])->name('index');
            Route::match(['get', 'post'], '/retrieve-data', [CustomersController::class, 'retrieveData'])->name('retrieveData');
            Route::match(['get', 'post'], '/{tracking_code}', [CustomersController::class, 'show'])->name('show');
        });
    });

    Route::name('profile.')->group(function () {
        Route::get('/profile', [ProfileController::class, 'show'])->name('show');
        Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/profile/update', [ProfileController::class, 'update'])->name('update');
        Route::delete('/profile/delete', [ProfileController::class, 'destroy'])->name('destroy');
    });
});

require __DIR__ . '/auth.php';
require __DIR__ . '/locale.php';
