<?php

namespace App\Http\Resources\Api2026;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'index' => $this->index,
            'key' => $this->key,

            'title' => $this->title,
            'fullName' => $this->full_name,
            'email' => $this->email,
            'emailVerifiedAt' => $this->email_verified_at,

            'dialCode' => $this->dial_code,
            'phoneNumber' => $this->phone_number,

            'identityType' => $this->identity_type,
            'identityNumber' => $this->identity_number,

            'gender' => $this->gender,
            'placeOfBirth' => $this->place_of_birth,
            'dateOfBirth' => $this->date_of_birth,

            'trackingCode' => $this->tracking_code,
            'hasCredit' => $this->has_credit,
            'isAgent' => $this->is_agent,

            'uplineId' => $this->upline_id,
            'countryId' => $this->country_id,
            'countryName' => $this->countries?->name,
            'stateId' => $this->state_id,
            'stateName' => $this->states?->name,
            'cityId' => $this->city_id,
            'cityName' => $this->cities?->name,

            'address' => $this->address,
            'zipCode' => $this->zip_code,

            'locale' => $this->locale,
            'currency' => $this->currency,

            'profilePhotoPath' => $this->profile_photo_path,

            'active' => $this->active,

            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }
}
