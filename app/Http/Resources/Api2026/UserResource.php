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

            'referralCode' => $this->referral_code,
            'hasCredit' => $this->has_credit,
            'isAgent' => $this->is_agent,

            'uplineId' => $this->upline_id,
            'countryId' => $this->country_id,
            'stateId' => $this->state_id,
            'cityId' => $this->city_id,

            'address' => $this->address,
            'zipCode' => $this->zip_code,

            'locale' => $this->locale,
            'currency' => $this->currency,

            'profilePhotoPath' => $this->profile_photo_path,

            'active' => $this->active,

            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'deletedAt' => $this->deleted_at,

            'createdBy' => $this->created_by,
            'updatedBy' => $this->updated_by,

            'index' => $this->index,
            'key' => $this->key,
        ];
    }
}
