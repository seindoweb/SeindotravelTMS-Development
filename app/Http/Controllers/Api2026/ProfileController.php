<?php

namespace App\Http\Controllers\Api2026;

use App\Constants\SystemConstant;
use App\Http\Controllers\Controller;
use App\Http\Resources\Api2026\UserResource;
use App\Models\City;
use App\Models\User;
use App\Services\Systems\ResponseFormatter;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{

    /**
     * fetchProfile
     *
     * @param Request $request
     * @return void
     */
    public function fetchProfile(Request $request)
    {
        try {
            return ResponseFormatter::success(
                [
                    'customer' => new UserResource(Auth::user()),
                    'info' => ''
                ]
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
                [
                    'customer' => new UserResource($user),
                    'info' => 'Identity updated successfully.'
                ]
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
                [
                    'customer' => new UserResource($user),
                    'info' => 'Address updated successfully.'
                ]
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
     * changePassword
     *
     * @param Request $request
     * @return void
     */
    public function changePassword(Request $request)
    {
        try {
            $rules = [
                'password'                  => ['string', 'max:255'],
                'newPassword'               => 'min:6|required_with:newPasswordConfirmation|same:newPasswordConfirmation',
                'newPasswordConfirmation'   => 'min:6'
            ];
            $request->validate($rules);
            // Retrieve the authenticated user
            $user = User::findOrFail(Auth::id());

            // Verify the current password
            if (!Hash::check($request->password, $user->password)) {

                throw new Exception('The current password is incorrect.');
            }

            $user->password = Hash::make($request->newPassword);

            if ($user->save()) {
                return ResponseFormatter::success(
                    [
                        'info' => 'Password changed successfully.'
                    ]
                );
            } else {
                throw new Exception('Password change failed.');
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
     * changeCurrency
     *
     * @param Request $request
     * @return void
     */
    public function changeCurrency(Request $request)
    {
        try {

            $rules = [
                'currency'    => ['required', 'string', 'in:' . implode(',', SystemConstant::AVAILABLE_CURRENCY)],
            ];

            $request->validate($rules);
            $user   = User::where('id', Auth::id())->firstOrFail();

            $user->currency = $request->input('currency');

            if ($user->save()) {
                $user = User::where('id', Auth::id())->firstOrFail();
            }

            return ResponseFormatter::success(
                [
                    new UserResource($user),
                    'info' => 'Currency updated successfully.'
                ]
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
     * changeLocale
     *
     * @param Request $request
     * @return void
     */
    public function changeLocale(Request $request)
    {
        try {

            $rules = [
                'locale'    => ['required', 'string', 'in:' . implode(',', SystemConstant::AVAILABLE_LOCALE)],
            ];

            $request->validate($rules);
            $user   = User::where('id', Auth::id())->firstOrFail();

            $user->locale = $request->input('locale');

            if ($user->save()) {
                $user = User::where('id', Auth::id())->firstOrFail();
            }

            return ResponseFormatter::success(
                [
                    new UserResource($user),
                    'info' => 'Locale updated successfully.'
                ]
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
