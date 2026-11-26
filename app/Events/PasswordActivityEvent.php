<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PasswordActivityEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * email
     *
     * @var mixed
     */
    public $email;

    /**
     * type
     *
     * @var mixed
     */
    public $type;

    /**
     * Create a new event instance.
     */
    public function __construct(string $email, string $type)
    {
        $this->email = $email;
        $this->type = $type;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('channel-name'),
        ];
    }
}
