<?php

namespace App\Http\Middleware;

use Inertia\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $locale = session('locale', 'en');
        if (Auth::check() && Auth::user()->locale) {
            $locale = Auth::user()->locale;
        }

        if (!in_array($locale, ['en', 'id'])) {
            $locale = 'en';
        }

        App::setLocale($locale);

        return [
            ...parent::share($request),
            'appLogo' => asset("assets/images/logo.svg"),
            'appIconDefault' => asset("assets/icons/icon-default.svg"),
            'appIconWhite' => asset("assets/icons/icon-white.svg"),
            'appName' => config("app.name"),
            'auth' => [
                'user' => $request->user(),
                'roles' =>  $request->user()?->getRoleNames() ?? [],
            ],
            'locale' => $locale,
            'translations' => [
                'auth' => trans('auth'),
            ],
        ];
    }
}
