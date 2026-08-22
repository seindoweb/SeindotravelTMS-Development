<?php

namespace App\Services\Systems;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Channels\DatabaseChannel as IlluminateDatabaseChannel;

class DatabaseChannel extends IlluminateDatabaseChannel
{
    /**
     * Send the given notification.
     *
     * @param mixed $notifiable
     * @param \Illuminate\Notifications\Notification $notification
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function send($notifiable, Notification $notification)
    {
        return $notifiable->routeNotificationFor('database')->create([
            'id'        => $notification->id,
            'type'      => get_class($notification),
            'platform'  => $notification?->platform ?? null,
            'data'      => $this->getData($notifiable, $notification),
            'read_at'   => null,
        ]);
    }
}
