<?php

namespace App\Services\HotelMicroserviceApi;

use Exception;

use Illuminate\Support\Facades\Log;
use RuntimeException;

class BookingPreview
{
    public static function getBookingPreview(string $sessionId): array
    {
        $request = [
            'sessionId' => $sessionId,
        ];

        $url = config('services.hotelMicroserviceApi.base_url') . '/booking-preview';

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

            if ($response === false) {
                throw new RuntimeException('cURL error: ' . curl_error($curl));
            }

            $res = json_decode($response, true, 512, JSON_THROW_ON_ERROR);

            if (($res['meta']['status'] ?? null) === 'error') {
                $errors = $res['data']['errors'] ?? 'Hotel API error';

                throw new RuntimeException(
                    is_string($errors) ? $errors : json_encode($errors)
                );
            }

            return $res['data'];
        } finally {
            unset($curl);
        }
    }
}
