<?php

namespace App\Http\Controllers\Api2026;

use Exception;
use App\Constants\SystemConstant;
use App\Events\PasswordActivityEvent;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Systems\ResponseFormatter;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class ResetPasswordController extends Controller
{
    /**
     * forgotPassword
     *
     * @param Request $request
     * @return void
     */
    public function forgotPassword(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => ['required', 'string', 'email', 'max:255'],
            ]);

            if (User::where('email', $validated['email'])->doesntExist()) {
                throw new Exception('The email you provided is not available.');
            } else {

                PasswordActivityEvent::dispatch($validated['email'], SystemConstant::PASSWORD_TYPE_ACTIVITY_REQ_OTP);
                return ResponseFormatter::success(
                    [
                        'info' => 'Your request was successful, please open your email, and enter the OTP code for verification.'
                    ]
                );
            }
        } catch (Exception $error) {
            return ResponseFormatter::error(
                [
                    'error' => $error->getMessage(),
                ],
            );
        }
    }

    /**
     * otpValidation
     *
     * @param Request $request
     * @return void
     */
    public function otpValidation(Request $request)
    {
        try {
            $validated = $request->validate([
                'code'           => ['required'],
                'email'         => ['required', 'string', 'email', 'max:255']
            ]);

            $user = User::where('email', $validated['email'])->first();
            $token = DB::table('password_reset_tokens')->where('email', $validated['email'])->where('token', $validated['code'])->first();
            if (!$user) {
                throw new Exception('The email you provided is not available.');
            } else {

                if (!$token) {
                    throw new Exception('That code doesn’t match. Please double-check the 6-digit code sent to your email, or request a new one.');
                }

                if ($user->email !=  $token->email) {
                    throw new Exception("The email doesn't match our records.");
                }

                // OTP expires after 18 minutes.
                $expiredAt = Carbon::parse($token->created_at)->addMinutes(18);
                if (Carbon::now()->greaterThan($expiredAt)) {
                    throw new Exception('This otp has expired. Please request a new code to continue.');
                }

                return ResponseFormatter::success(
                    [
                        'status' => true,
                        'info' => 'You can now proceed to reset your password.'
                    ]
                );
            }
        } catch (Exception $error) {
            return ResponseFormatter::error(
                [
                    'error' => $error->getMessage(),
                ],
            );
        }
    }

    /**
     * newPassword
     *
     * @param Request $request
     * @return void
     */
    public function newPassword(Request $request)
    {
        try {
            $validated = $request->validate([
                'code'                  => ['required'],
                'email'                 => ['required', 'string', 'email', 'max:255'],
                'password'              => ['required', 'min:6', 'required_with:passwordConfirmation', 'same:passwordConfirmation'],
                'passwordConfirmation'  => ['required', 'min:6'],
            ]);

            $user = User::where('email', $request->email)->first();
            $token = DB::table('password_reset_tokens')->where('email', $validated['email'])->where('token', $validated['code'])->first();
            if (!$user) {
                throw new Exception('The email you provided is not available.');
            } else {

                if (!$token) {
                    throw new Exception('That code doesn’t match. Please double-check the 6-digit code sent to your email, or request a new one.');
                }

                if ($user->email !=  $token->email) {
                    throw new Exception("The email doesn't match our records.");
                }

                // OTP expires after 18 minutes.
                $expiredAt = Carbon::parse($token->created_at)->addMinutes(18);
                if (Carbon::now()->greaterThan($expiredAt)) {
                    throw new Exception('This otp has expired. Please request a new code to continue.');
                }

                $user->forceFill([
                    'password' => Hash::make($validated['password']),
                ])->saveQuietly();

                PasswordActivityEvent::dispatch($validated['email'], SystemConstant::PASSWORD_TYPE_ACTIVITY_PASS_CHA);

                return ResponseFormatter::success(
                    [
                        'info' => 'Your password has been reset successfully. You can now log in with your new password.'
                    ]
                );
            }
        } catch (Exception $error) {
            return ResponseFormatter::error(
                [
                    'error' => $error->getMessage(),
                ],
            );
        }
    }
}
