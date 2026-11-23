<?php

namespace App\Http\Controllers\Api2026;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api2026\UserResource;
use App\Models\City;
use App\Models\User;
use App\Services\Systems\ResponseFormatter;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{

    /**
     * fetch
     *
     * @param Request $request
     * @return void
     */
    public function fetch(Request $request)
    {
        try {
            return ResponseFormatter::success(
                new UserResource(Auth::user())
            );
        } catch (Exception $error) {
            return ResponseFormatter::error(
                [
                    'error' => $error->getMessage(),
                ],
            );
        }
    }

    /**
     * updateIdentity
     *
     * @param Request $request
     * @return void
     */
    public function updateIdentity(Request $request)
    {
        try {
            $user   = User::findOrFail(Auth::id());

            $rules = [
                'title'             => ['required', 'string', 'max:255'],
                'fullName'          => ['required', 'string', 'max:255'],
                'dialCode'          => ['required', 'string'],
                'phoneNumber'       => ['required', 'string', 'max:255'],
                'gender'            => ['nullable', 'string', 'in:Male,Female,Rather not say,Custom'],
                'placeOfBirth'      => ['nullable', 'string', 'max:255'],
                'dateOfBirth'       => ['nullable', 'date', 'max:255'],
                'identityType'      => ['nullable', 'string', 'max:255', 'in:KTP,Passport,SIM'],
                'identityNumber'    => ['nullable', 'string', 'max:255'],
            ];

            $request->validate($rules);

            $query = [
                'title'             => $request->title,
                'full_name'        => $request->fullName,
                'dial_code'         => $request->dialCode,
                'phone_number'      => $request->phoneNumber,
                'gender'            => $request->gender,
                'place_of_birth'    => $request->placeOfBirth,
                'date_of_birth'     => $request->dateOfBirth,
                'identity_type'     => $request->identityType,
                'identity_number'     => $request->identityNumber,
            ];

            $user->update($query);

            return ResponseFormatter::success(
                new UserResource($user),
            );
        } catch (Exception $error) {
            return ResponseFormatter::error(
                [
                    'error' => $error->getMessage(),
                ],
            );
        }
    }

    /**
     * updateAddress
     *
     * @param Request $request
     * @return void
     */
    public function updateAddress(Request $request)
    {
        try {
            $user   = User::findOrFail(Auth::id());

            $rules = [
                'locationId'        => ['nullable', 'numeric'],
                'address'           => ['nullable', 'string', 'max:255'],
                'zipCode'           => ['nullable', 'string', 'max:255'],
            ];

            $request->validate($rules);

            $query = [
                'address'           => $request->address,
                'zip_code'          => $request->zipCode,
            ];

            if ($request->locationId) {
                $city = City::findOrFail($request->locationId);
                $query['city_id'] = $city->id;
                $query['state_id'] = $city?->states->id;
                $query['country_id'] = $city?->states->countries->id;
            }

            $user->update($query);

            return ResponseFormatter::success(
                new UserResource($user),
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
