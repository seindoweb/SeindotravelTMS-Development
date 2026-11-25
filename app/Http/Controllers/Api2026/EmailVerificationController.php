<?php

namespace App\Http\Controllers\Api2026;

use App\Events\RegisterActivityEvent;
use App\Http\Controllers\Controller;
use App\Services\Systems\ResponseFormatter;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class EmailVerificationController extends Controller
{
    /**
     * request
     *
     * @param Request $request
     * @return void
     */
    public function request(Request $request)
    {
        try {
            $user = Auth::user();

            if (!is_null($user->email_verified_at)) {
                return ResponseFormatter::success([
                    'info' => 'Your email is already verified. No further action is needed.',
                ]);
            }

            [$name, $domain] = explode('@', $user->email);
            $email = Str::mask($name, '*', 2) . '@' . $domain;
            RegisterActivityEvent::dispatch($user);

            return ResponseFormatter::success(
                [
                    'info' => 'We’ve sent a verification code to [' . $email . ']. Please enter the code below to continue.'
                ]
            );
        } catch (Exception $error) {
            return ResponseFormatter::error([
                'error' => $error->getMessage(),
            ], null, 422);
        }
    }

    public function verify(Request $request)
    {
        try {
            /** @var User $user */
            $user = Auth::user();

            $validated = $request->validate([
                'code' => ['required'],
            ]);

            $validated['email'] = $user->email;

            $verification = DB::table('email_verification_codes')->where('email', $validated['email'])->where('code', $validated['code'])->first();

            if (!$verification) {
                throw new Exception('That code doesn’t match. Please double-check the 6-digit code sent to your email, or request a new one.');
            }

            // OTP expires after 18 minutes.
            $expiredAt = Carbon::parse($verification->created_at)->addMinutes(18);
            if (Carbon::now()->greaterThan($expiredAt)) {
                throw new Exception('This verification code has expired. Please request a new code to continue.');
            }

            $user->forceFill([
                'email_verified_at' => Carbon::now(),
            ])->saveQuietly();

            return ResponseFormatter::success(
                [
                    'info' => 'Code verified! Thank you for confirming your email. You can now access your account.'
                ]
            );
        } catch (Exception $error) {
            return ResponseFormatter::error([
                'error' => $error->getMessage(),
            ], null, 422);
        }
    }
}
