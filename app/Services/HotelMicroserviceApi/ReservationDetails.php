<?php

namespace App\Services\HotelMicroserviceApi;

use Illuminate\Support\Facades\Log;
use RuntimeException;

class ReservationDetails
{
    public static function getReservationDetails(array $params): array
    {
        $request = [
            'providerBookingID' => isset($params['providerBookingID']) ? $params['providerBookingID'] : null,
            'agencyBookingID' => isset($params['agencyBookingID']) ? $params['agencyBookingID'] : null,
        ];

        $url = config('services.hotelMicroserviceApi.base_url').'/reservation-details';

        $headers = [
            'AccessPermissionToken: '.config('services.hotelMicroserviceApi.access_permission_token'),
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
                CURLOPT_TIMEOUT => 45,
                CURLOPT_CONNECTTIMEOUT => 15,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_2_0,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => json_encode($request, JSON_THROW_ON_ERROR),
                CURLOPT_HTTPHEADER => $headers,
            ]);

            $response = curl_exec($curl);

            if ($response === false) {
                $err = curl_error($curl);
                Log::error('ReservationDetails cURL error: '.$err, ['request' => $request]);

                return [
                    'meta' => [
                        'status' => 'error',
                        'code' => 500,
                        'message' => 'cURL error: '.$err,
                    ],
                    'data' => [
                        'errors' => ['general' => $err],
                    ],
                ];
            }

            $res = json_decode($response, true);

            if (! is_array($res)) {
                Log::error('ReservationDetails invalid JSON response: '.$response, ['request' => $request]);

                return [
                    'meta' => [
                        'status' => 'error',
                        'code' => 500,
                        'message' => 'Invalid JSON response from hotel microservice',
                    ],
                    'data' => [
                        'errors' => ['general' => 'Invalid JSON response'],
                    ],
                ];
            }

            return $res;
        } finally {
            unset($curl);
        }
    }
}
