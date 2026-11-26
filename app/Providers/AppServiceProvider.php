<?php

namespace App\Providers;

use App\Services\Systems\DatabaseChannel;
use Illuminate\Notifications\Channels\DatabaseChannel as IlluminateDatabaseChannel;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Laravel\Sanctum\PersonalAccessToken;
use Laravel\Sanctum\Sanctum;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->app->instance(IlluminateDatabaseChannel::class, new DatabaseChannel);
        Vite::prefetch(concurrency: 3);
        Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);
    }
}
