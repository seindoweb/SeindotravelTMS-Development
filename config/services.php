<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Resend, Postmark, AWS, and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'hotelMicroserviceApi' => [
        'base_url' => env('HOTEL_MICROSERVICE_API_URL', 'https://travelhotelcdn.seindo.dev/api/v2026'),
        'access_permission_token' => env('HOTEL_MICROSERVICE_API_ACCESS_PERMISSION_TOKEN', 'master-access-token'),
    ],

    'mgbedbank' => [
        'agency_code'       => env('MGBEDBANK_AGENCY_CODE', 'AGID013799'),
        'username'          => env('MGBEDBANK_USERNAME', 'SEIGTINJsonV1'),
        'password'          => env('MGBEDBANK_PASSWORD', '52!n6OG1062L75'),
        'currency'          => env('MGBEDBANK_DEFAULT_CURRENCY', 'IDR'),
        'url'               => env('MGBEDBANK_URL', 'http://uat-jarvis1-xmlsell.mgbedbank.com')
    ],

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],


];
