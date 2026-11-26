<?php

namespace App\Listeners;

use App\Constants\SystemConstant;
use App\Events\PasswordActivityEvent;
use App\Models\User;
use App\Notifications\PasswordActivityNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class PasswordActivityListener
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
    public function handle(PasswordActivityEvent $event): void
    {
        if (isset($event->type) && $event->type === SystemConstant::PASSWORD_TYPE_ACTIVITY_REQ_OTP) {
            $code = (string) random_int(123456, 987654);
            DB::table('password_reset_tokens')->updateOrInsert(
                ['email' => $event->email],
                [
                    'token' => $code,
                    'created_at' => now(),
                ]
            );

            $offerData = [
                'title' => "Password Reset Code Sent",
                'message' => "If an account exists with that email, we've sent a password reset code to your inbox.",
                'code' => $code,
                'url' => null
            ];

            Notification::send(User::query()->where('email', $event->email)->first(), new PasswordActivityNotification($offerData, $event->type, SystemConstant::NOTIFICATION_PLATFORM_WEBMOBILE));
        } else if (isset($event->type) && $event->type === SystemConstant::PASSWORD_TYPE_ACTIVITY_PASS_CHA) {
            $offerData = [
                'title' => "Password Reset Successful",
                'message' => "Your password has been updated. If you did not make this change, please contact support immediately.",
                'email' => $event->email,
                'url' => null
            ];

            Notification::send(User::query()->where('email', $event->email)->first(), new PasswordActivityNotification($offerData, $event->type, SystemConstant::NOTIFICATION_PLATFORM_WEBMOBILE));
        }
    }
}
