<?php

namespace App\Events;

use App\Models\OrderProductAttribute;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MonitoringHotelProductAttributeOrderEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * orderProductAttribute
     *
     * @var \App\Models\OrderProductAttribute
     */
    public $orderProductAttribute;

    /**
     * Create a new event instance.
     */
    public function __construct(OrderProductAttribute $orderProductAttribute)
    {
        $this->orderProductAttribute = $orderProductAttribute;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        return [
            // new PrivateChannel('channel-name'),
        ];
    }
}
