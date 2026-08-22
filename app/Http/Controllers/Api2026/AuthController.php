<?php

namespace App\Http\Controllers\Api2026;

use App\Events\LoginActivityEvent;
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
}
