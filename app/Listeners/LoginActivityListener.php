<?php

namespace App\Listeners;

use App\Constants\SystemConstant;
use App\Events\LoginActivityEvent;
use App\Events\NotificationWebMobileEvent;
use App\Notifications\LoginActivitNotification;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Notification;

class LoginActivityListener
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
    public function handle(LoginActivityEvent $event): void
    {
        $time = Carbon::now()->format('d-m-Y H:i');
        $appName = config('app.name');
        $offerData = [
            'title' => 'Security Information',
            'message' => "Login activity detected on your {$appName} account on {$time}.",
            'url' => null
        ];

        Notification::send($event?->user, new LoginActivitNotification($offerData, SystemConstant::NOTIFICATION_PLATFORM_WEBMOBILE));
        sleep(1);

        NotificationWebMobileEvent::dispatch($event?->user?->referral_code, $offerData);
    }
}
