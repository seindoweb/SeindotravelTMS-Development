<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotificationWebMobileEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $token;
    public $message;

    /**
     * Create a new event instance.
     */
    public function __construct($token, $message = null)
    {
        $this->token = $token;
        $this->message = $message;
    }


    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {

        // return new PrivateChannel('stcrm.notification.' . $this->token);
        return [
            new PrivateChannel('WebMobile.WS.User.Notification.' . $this->token),
            new Channel('WebMobile.WS.User.Broadcast'),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        // return 'NewNotificationReminder';
        return 'web.mobile.notifications';
    }
}
