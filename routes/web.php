<?php

use App\Http\Controllers\Pages\DashboardController;
use App\Http\Controllers\Pages\Finances\FlightsViaController;
use App\Http\Controllers\Pages\Finances\HotelsMgController;
use App\Http\Controllers\Pages\Hotels\HotelBookingController;
use App\Http\Controllers\Pages\Hotels\HotelMarkupController;
use App\Http\Controllers\Pages\Hotels\HotelOrderController;
use App\Http\Controllers\Pages\Users\AdministratorsController;
use App\Http\Controllers\Pages\Users\CustomersController;
use App\Http\Controllers\Pages\Users\TravellersController;
use App\Http\Controllers\Pages\Vouchers\AllVouchersController;
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
        Route::match(['get', 'post'], '/retrieve-larecu', [DashboardController::class, 'retrieveLarecu'])->name('retrieveLarecu');
        Route::match(['get', 'post'], '/retrieve-supbal', [DashboardController::class, 'retrieveSupbal'])->name('retrieveSupbal');
        Route::match(['get', 'post'], '/retrieve-actus', [DashboardController::class, 'retrieveActus'])->name('retrieveActus');
    });

    Route::prefix('finance')->name('finance.')->group(function () {
        Route::prefix('flights')->name('flights.')->group(function () {
            Route::prefix('via')->name('via.')->group(function () {
                Route::match(['get', 'post'], '/', [FlightsViaController::class, 'index'])->name('index');
                Route::match(['get', 'post'], '/create', [FlightsViaController::class, 'create'])->name('create');
                Route::match(['get', 'post'], '/store', [FlightsViaController::class, 'store'])->name('store');
            });
        });

        Route::prefix('hotels')->name('hotels.')->group(function () {
            Route::prefix('mg')->name('mg.')->group(function () {
                Route::match(['get', 'post'], '/', [HotelsMgController::class, 'index'])->name('index');
                Route::match(['get', 'post'], '/create', [HotelsMgController::class, 'create'])->name('create');
                Route::match(['get', 'post'], '/store', [HotelsMgController::class, 'store'])->name('store');
            });
        });
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
            Route::match(['get', 'post'], '/{code}/details', [HotelOrderController::class, 'orderDetails'])->name('orderDetails');
            Route::match(['get', 'post'], '/{code}/issued', [HotelOrderController::class, 'orderIssued'])->name('orderIssued');
            Route::match(['get', 'post'], '/{code}/book-reference', [HotelOrderController::class, 'orderBookReference'])->name('orderBookReference');
            Route::match(['get', 'post'], '/{code}/download-pdf', [HotelOrderController::class, 'orderDownloadPdf'])->name('orderDownloadPdf');
            Route::match(['get', 'post'], '/{code}/preview-pdf', [HotelOrderController::class, 'orderPreviewPdf'])->name('orderPreviewPdf');
        });

        Route::prefix('bookings')->name('bookings.')->group(function () {
            Route::match(['get', 'post'], '/', [HotelBookingController::class, 'index'])->name('index');
            Route::match(['get', 'post'], '/search', [HotelBookingController::class, 'search'])->name('search');
            Route::match(['get', 'post'], '/guest', [HotelBookingController::class, 'guest'])->name('guest');
            Route::match(['get', 'post'], '/create/{session_id}/{customer_tracking_code}', [HotelBookingController::class, 'create'])->name('create');
        });

        Route::prefix('markups')->name('markups.')->group(function () {
            Route::prefix('hotel')->name('hotel.')->group(function () {
                Route::match(['get', 'post'], '/', [HotelMarkupController::class, 'indexByHotel'])->name('index');
                Route::match(['get', 'post'], '/create', [HotelMarkupController::class, 'createHotel'])->name('create');
                Route::match(['get', 'post'], '/edit/{id}', [HotelMarkupController::class, 'editHotel'])->name('edit');
            });

            Route::prefix('destination')->name('destination.')->group(function () {
                Route::match(['get', 'post'], '/', [HotelMarkupController::class, 'indexByDestination'])->name('index');
                Route::match(['get', 'post'], '/create', [HotelMarkupController::class, 'createDestination'])->name('create');
                Route::match(['get', 'post'], '/{id}/edit', [HotelMarkupController::class, 'editDestination'])->name('edit');
            });
        });
    });

    Route::prefix('flights')->name('flights.')->group(function () {
        Route::match(['get', 'post'], '/', [DashboardController::class, 'index'])->name('index');
    });

    Route::prefix('tours')->name('tours.')->group(function () {
        Route::match(['get', 'post'], '/', [DashboardController::class, 'index'])->name('index');
    });

    Route::prefix('voucher')->name('voucher.')->group(function () {
        Route::match(['get', 'post'], '/flight', [AllVouchersController::class, 'indexFlight'])->name('indexFlight');
        Route::match(['get', 'post'], '/flight/create', [AllVouchersController::class, 'createFlight'])->name('createFlight');
        Route::match(['get', 'post'], '/hotel', [AllVouchersController::class, 'indexHotel'])->name('indexHotel');
        Route::match(['get', 'post'], '/hotel/create', [AllVouchersController::class, 'createHotel'])->name('createHotel');
        Route::match(['get', 'post'], '/tour', [AllVouchersController::class, 'indexTour'])->name('indexTour');
        Route::match(['get', 'post'], '/tour/create', [AllVouchersController::class, 'createTour'])->name('createTour');
        Route::prefix('distribution-type')->name('disty.')->group(function () {
            Route::match(['get', 'post'], '/personal', [AllVouchersController::class, 'indexDistyPersonal'])->name('indexPersonal');
            Route::match(['get', 'post'], '/public', [AllVouchersController::class, 'indexDistyPublic'])->name('indexPublic');
        });
        Route::post('/store', [AllVouchersController::class, 'store'])->name('store');
        Route::match(['get', 'post'], '/{voucher}/edit', [AllVouchersController::class, 'edit'])->name('edit');
        Route::match(['put', 'patch', 'post'], '/{voucher}', [AllVouchersController::class, 'update'])->name('update');
        Route::delete('/{voucher}', [AllVouchersController::class, 'destroy'])->name('destroy');
        Route::patch('/{voucher}/toggle-status', [AllVouchersController::class, 'toggleStatus'])->name('toggleStatus');
        Route::post('/{voucher}/translations', [AllVouchersController::class, 'saveTranslation'])->name('saveTranslation');
        Route::delete('/{voucher}/translations/{locale}', [AllVouchersController::class, 'deleteTranslation'])->name('deleteTranslation');
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

        Route::prefix('travellers')->name('travellers.')->group(function () {
            Route::match(['get', 'post'], '/', [TravellersController::class, 'index'])->name('index');
            Route::match(['get', 'post'], '/retrieve-data', [TravellersController::class, 'retrieveData'])->name('retrieveData');
            Route::match(['get', 'post'], '/create', [TravellersController::class, 'create'])->name('create');
            Route::post('/store', [TravellersController::class, 'store'])->name('store');
            Route::get('/search-customers', [TravellersController::class, 'searchCustomers'])->name('searchCustomers');
            Route::match(['get', 'post'], '/{id}/edit', [TravellersController::class, 'edit'])->name('edit');
            Route::match(['put', 'patch', 'post'], '/{id}', [TravellersController::class, 'update'])->name('update');
            Route::delete('/{id}', [TravellersController::class, 'destroy'])->name('destroy');
        });
    });

    Route::name('profile.')->group(function () {
        Route::get('/profile', [ProfileController::class, 'show'])->name('show');
        Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/profile/update', [ProfileController::class, 'update'])->name('update');
        Route::delete('/profile/delete', [ProfileController::class, 'destroy'])->name('destroy');
    });
});

use App\Constants\ModelConstant;
use App\Events\MonitoringHotelProductAttributeOrderEvent;
use App\Models\OrderProductAttribute;
use Illuminate\Database\Eloquent\Builder;

Route::get('/test', function () {
    $orderProductAttribute = OrderProductAttribute::whereHas('productAttribute', function (Builder $productAttribute) {
        $productAttribute->where('attribute', ModelConstant::PRODUCT_ATTRIBUTE_HOTEL);
    })->whereIn('order_status', [ModelConstant::ORDER_STATUS_BOOKING, ModelConstant::ORDER_STATUS_PROGRESS])
        ->orWhere('order_status', true)
        ->get();

    foreach ($orderProductAttribute ?: [] as $orderAtt) {
        MonitoringHotelProductAttributeOrderEvent::dispatch($orderAtt);
    }
});

require __DIR__.'/auth.php';
require __DIR__.'/locale.php';
