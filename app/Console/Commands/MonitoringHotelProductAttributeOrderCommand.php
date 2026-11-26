<?php

namespace App\Console\Commands;

use App\Constants\ModelConstant;
use App\Events\MonitoringHotelProductAttributeOrderEvent;
use App\Models\OrderProductAttribute;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Builder;

class MonitoringHotelProductAttributeOrderCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:monitoring-hotel-product-attribute-order-command';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command serves to monitor hotel bookings.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $orderProductAttribute = OrderProductAttribute::whereHas('productAttribute', function (Builder $productAttribute) {
            $productAttribute->where('attribute', ModelConstant::PRODUCT_ATTRIBUTE_HOTEL);
        })->whereHas('order', function (Builder $order) {
            $order->where('payment_status', ModelConstant::PAYMENT_STATUS_PAID);
        })->whereIn('order_status', [ModelConstant::ORDER_STATUS_BOOKING, ModelConstant::ORDER_STATUS_PROGRESS, ModelConstant::ORDER_STATUS_EXPIRED])
            ->orWhere('is_retryable', true)
            ->get();

        foreach ($orderProductAttribute ?: [] as $orderAtt) {
            MonitoringHotelProductAttributeOrderEvent::dispatch($orderAtt);
        }

        return Command::SUCCESS;
    }
}
