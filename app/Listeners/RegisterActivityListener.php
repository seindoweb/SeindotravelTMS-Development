<?php

namespace App\Listeners;

use App\Constants\SystemConstant;
use App\Events\RegisterActivityEvent;
use App\Notifications\RegisterActivityNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;


class RegisterActivityListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(RegisterActivityEvent $event): void
    {
        $code = (string) random_int(100000, 999999);
        if ($event?->user) {
            DB::table('email_verification_codes')->updateOrInsert(
                ['email' => $event->user->email],
                [
                    'code' => $code,
                    'created_at' => now(),
                ]
            );

            $offerData = [
                'title' => 'Welcome to ' . config("app.name"),
                'message' => 'A verification code has been sent to your email address. Please check your inbox and verify your email as soon as possible.',
                'code' => $code,
                'url' => null
            ];


            Notification::send($event?->user, new RegisterActivityNotification($offerData, SystemConstant::NOTIFICATION_PLATFORM_WEBMOBILE));
        }
    }
}
