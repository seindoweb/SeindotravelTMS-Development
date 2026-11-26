<?php

use App\Http\Middleware\ApiAccessToken;
use App\Http\Middleware\ApplyLocale;
use App\Http\Middleware\EnsureUserHasRole;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\LastActiveUser;
use App\Services\Systems\ResponseFormatter;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        channels: __DIR__.'/../routes/channels.php',
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            ApplyLocale::class,
            HandleInertiaRequests::class,
            LastActiveUser::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'has.role' => EnsureUserHasRole::class,
            'api.client' => ApiAccessToken::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        /*
        |--------------------------------------------------------------------------
        | Render API as JSON
        |--------------------------------------------------------------------------
        */
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        /*
        |--------------------------------------------------------------------------
        | 401 - Unauthenticated
        |--------------------------------------------------------------------------
        */
        $exceptions->render(function (
            AuthenticationException $error,
            Request $request
        ) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return ResponseFormatter::error(
                    null,
                    $error->getMessage() ?: 'Unauthenticated.',
                    401
                );
            }
        });

        /*
        |--------------------------------------------------------------------------
        | 422 - Validation Error
        |--------------------------------------------------------------------------
        */
        $exceptions->render(function (
            ValidationException $error,
            Request $request
        ) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return ResponseFormatter::error(
                    [
                        'errors' => $error->errors(),
                    ],
                    $error->getMessage(),
                    422
                );
            }
        });

        /*
        |--------------------------------------------------------------------------
        | 404 - Not Found
        |--------------------------------------------------------------------------
        */
        $exceptions->render(function (
            NotFoundHttpException $error,
            Request $request
        ) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return ResponseFormatter::error(
                    null,
                    'Resource not found.',
                    404
                );
            }
        });

        /*
        |--------------------------------------------------------------------------
        | HTTP Exception
        |--------------------------------------------------------------------------
        */
        $exceptions->render(function (
            HttpException $error,
            Request $request
        ) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return ResponseFormatter::error(
                    null,
                    $error->getMessage() ?: 'HTTP error.',
                    $error->getStatusCode()
                );
            }
        });

        /*
        |--------------------------------------------------------------------------
        | 500 - Server Error
        |--------------------------------------------------------------------------
        */
        $exceptions->render(function (
            Throwable $error,
            Request $request
        ) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return ResponseFormatter::error(
                    null,
                    config('app.debug')
                        ? $error->getMessage()
                        : 'Internal server error.',
                    500
                );
            }
        });
    })->create();
