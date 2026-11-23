<?php

namespace App\Http\Middleware;

use Carbon\Carbon;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class LastActiveUser
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            /** @var User $user */
            $user = Auth::user();

            // Update setiap 5 menit menggunakan Carbon
            if (
                !$user->last_active_at ||
                Carbon::parse($user->last_active_at)->lt(Carbon::now()->subMinutes(5))
            ) {
                $user->forceFill([
                    'last_active_at' => Carbon::now(),
                ])->saveQuietly();
            }
        }

        return $next($request);
    }
}
