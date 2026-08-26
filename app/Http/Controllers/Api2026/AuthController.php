<?php

namespace App\Http\Controllers\Api2026;

use App\Constants\SystemConstant;
use App\Events\LoginActivityEvent;
use App\Events\RegisterActivityEvent;
use App\Http\Controllers\Controller;
use App\Http\Resources\Api2026\UserResource;
use App\Models\User;
use App\Services\Systems\ResponseFormatter;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * login
     *
     * @param Request $request
     * @return void
     */
    public function login(Request $request)
    {
        try {
            // Validation Email & Password
            $request->validate([
                'email' => ['email', 'required'],
                'password' => ['required'],
                'currency' => ['nullable', 'in:USD,IDR'],
                'locale' => ['nullable', 'in:id,en'],
            ]);

            // Check credentials (login)
            $credentials = $request->only('email', 'password');
            $credentials['email'] = Str::lower($credentials['email']);

            if (!Auth::attempt($credentials)) {
                return ResponseFormatter::error(
                    ['error' => 'Invalid username/password'],
                    'Authentication Failed',
                    401
                );
            }

            // Invalid credentials
            $user = User::findOrFail(Auth::id());

            if (!Hash::check($request->password, $user->password, [])) {
                throw new Exception('Invalid Credentials');
            }

            // Set Default Currency
            if ($request->input('currency') != null || $request->input('currency') != "") {
                $user->currency = $request->input('currency');
            }

            // Set Default Locale
            if ($request->input('locale') != null || $request->input('locale') != "") {
                $user->locale = $request->input('locale');
            }

            $user->save();


            // Send login activity notification
            LoginActivityEvent::dispatch($user);

            // Valid Credentials
            $tokenResults = $user->createToken('authToken')->plainTextToken;
            return ResponseFormatter::success(
                [
                    'access_token' => $tokenResults,
                    'token_type' => 'Bearer',
                    'user' => new UserResource($user),
                ],
            );
        } catch (Exception $error) {
            return ResponseFormatter::error(
                [
                    'error' => $error->getMessage(),
                ],
            );
        }
    }

    public function register(Request $request)
    {
        try {
            // Validation
            $request->validate([
                'fullName' => ['required', 'string', 'max:255'],
                'dialCode' => ['required', 'string', 'max:255'],
                'phoneNumber' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
                'password' => 'min:6|required_with:passwordConfirmation|same:passwordConfirmation',
                'passwordConfirmation' => 'min:6',
                'referral_code' => ['nullable'],
                'currency' => ['nullable', 'in:USD,IDR'],
                'locale' => ['nullable', 'in:id,en'],
            ]);

            $upline = null;
            if ($request->referral_code) {
                $upline = User::where('tracking_code', $request->referral_code)->first();
            }

            $data = [
                'full_name' => $request->fullName,
                'dial_code' => $request->dialCode,
                'phone_number' => $request->phoneNumber,
                'email' => Str::lower($request->email),
                'password' => Hash::make($request->password),
                'currency' => $request->input('currency') ?? SystemConstant::DEFAULT_CURRENCY,
                'locale' => $request->input('locale') ?? SystemConstant::DEFAULT_LOCALE,
                'upline_id' => $upline?->id ?? null,
            ];

            $user = User::create($data);

            RegisterActivityEvent::dispatch($user);

            return ResponseFormatter::success([
                'access_token' => $user->createToken('authToken')->plainTextToken,
                'token_type' => 'Bearer',
                'user' => new UserResource($user),
            ], 'Authenticated');
        } catch (Exception $error) {
            return ResponseFormatter::error([
                'error' => $error->getMessage(),
            ], null, 422);
        }
    }
}
