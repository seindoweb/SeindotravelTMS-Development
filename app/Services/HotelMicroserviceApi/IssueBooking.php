<?php

namespace App\Services\HotelMicroserviceApi;

use Illuminate\Support\Facades\Log;
use RuntimeException;

class IssueBooking
{
    public static function postIssueBooking(array $params): array
    {
        $request = [
            'sessionId' => $params['sessionId'],
            'agencyBookingID' => $params['agencyBookingID'],
        ];

        $url = config('services.hotelMicroserviceApi.base_url').'/issue-booking';

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
                Log::error('IssueBooking cURL error: '.$err, ['request' => $request]);

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
                Log::error('IssueBooking invalid JSON response: '.$response, ['request' => $request]);

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
