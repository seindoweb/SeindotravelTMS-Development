<?php

namespace App\Services\HotelMicroserviceApi;

use Exception;

use Illuminate\Support\Facades\Log;
use RuntimeException;

class ReservationDetails
{
    public static function getReservationDetails(array $params): array
    {
        $request = [
            'providerBookingID' => isset($params['providerBookingID']) ? $params['providerBookingID'] : null,
            'agencyBookingID' => isset($params['agencyBookingID']) ? $params['agencyBookingID'] : null
        ];

        $url = config('services.hotelMicroserviceApi.base_url') . '/reservation-details';

        $headers = [
            'AccessPermissionToken: ' . config('services.hotelMicroserviceApi.access_permission_token'),
            'Content-Type: application/json',
        ];

        $curl = curl_init();

        if ($curl === false) {
            throw new RuntimeException('Failed to initialize cURL');
        }

        try {
            curl_setopt_array($curl, [
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_CONNECTTIMEOUT => 10,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_2_0,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => json_encode($request, JSON_THROW_ON_ERROR),
                CURLOPT_HTTPHEADER => $headers,
            ]);

            $response = curl_exec($curl);

            $res = json_decode($response, true);

            return $res;
        } finally {
            unset($curl);
        }
    }
}
