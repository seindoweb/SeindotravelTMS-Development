<?php

namespace App\Services\HotelMicroserviceApi;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BookingPreview
{
    public static function getBookingPreview(string $sessionId): array
    {
        // try {
        //     $response = Http::acceptJson()
        //         ->withHeaders(['AccessPermissionToken' => config('services.hotelMicroserviceApi.access_permission_token')])
        //         ->timeout(30)
        //         ->post(
        //             rtrim(config('services.hotelMicroserviceApi.base_url'), '/') . '/booking-preview',
        //             [
        //                 'sessionId' => $sessionId,
        //             ]
        //         );
        //     dd($response);
        //     if ($response->failed()) {
        //         Log::error('Failed to get booking preview', [
        //             'session_id' => $sessionId,
        //             'status' => $response->status(),
        //             'response' => $response->body(),
        //         ]);

        //         return [
        //             'success' => false,
        //             'message' => 'Failed to retrieve booking preview.',
        //             'data' => null,
        //         ];
        //     }

        //     return [
        //         'success' => true,
        //         'message' => 'Booking preview retrieved successfully.',
        //         'data' => $response->json('data', $response->json()),
        //     ];
        // } catch (\Throwable $e) {
        //     Log::error('Booking preview API exception', [
        //         'session_id' => $sessionId,
        //         'error' => $e->getMessage(),
        //     ]);

        //     return [
        //         'success' => false,
        //         'message' => 'Unable to connect to Hotel Microservice API.',
        //         'data' => null,
        //     ];
        // }
    }
}
