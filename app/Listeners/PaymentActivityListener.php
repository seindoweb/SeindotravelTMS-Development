<?php

namespace App\Listeners;

use App\Constants\ModelConstant;
use App\Constants\SystemConstant;
use App\Events\NotificationWebMobileEvent;
use App\Events\PaymentActivityEvent;
use App\Notifications\PaymentActivityNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Notification;

class PaymentActivityListener
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
    public function handle(PaymentActivityEvent $event): void
    {
        $orderUrl = array();
        $data = array(
            'invoice_number' => $event?->order?->invoice_number,
            'currency_code' => $event?->order?->currency_code,
            'total_amount' => $event?->order?->total_amount
        );
        $offerData = match ($event?->order?->payment_status) {
            ModelConstant::PAYMENT_STATUS_UNPAID => [
                'title' => 'Payment Unpaid',
                'message' => "Your payment for order #{$event?->order?->invoice_number} has not been made yet.",
                'data' => $data,
                'url' => $orderUrl,
            ],

            ModelConstant::PAYMENT_STATUS_PENDING => [
                'title' => 'Payment Pending',
                'message' => "Your payment for order #{$event?->order?->invoice_number} is awaiting confirmation.",
                'data' => $data,
                'url' => $orderUrl,
            ],

            ModelConstant::PAYMENT_STATUS_PARTIALLY => [
                'title' => 'Payment Partially Paid',
                'message' => "Your payment for order #{$event?->order?->invoice_number} has been partially received. Please complete the remaining balance.",
                'data' => $data,
                'url' => $orderUrl,
            ],

            ModelConstant::PAYMENT_STATUS_PAID => [
                'title' => 'Payment Received',
                'message' => "Your payment for order #{$event?->order?->invoice_number} has been successfully received.",
                'data' => $data,
                'url' => $orderUrl,
            ],

            ModelConstant::PAYMENT_STATUS_EXPIRED => [
                'title' => 'Payment Expired',
                'message' => "The payment deadline for order #{$event?->order?->invoice_number} has expired.",
                'data' => $data,
                'url' => $orderUrl,
            ],

            ModelConstant::PAYMENT_STATUS_FAILED => [
                'title' => 'Payment Failed',
                'message' => "Your payment for order #{$event?->order?->invoice_number} could not be completed. Please try again.",
                'data' => $data,
                'url' => $orderUrl,
            ],

            default => [
                'title' => 'Payment Status Updated',
                'message' => "The payment status for order #{$event?->order?->invoice_number} has been updated.",
                'data' => $data,
                'url' => $orderUrl,
            ],
        };
        Notification::send($event?->order?->user, new PaymentActivityNotification($offerData, SystemConstant::NOTIFICATION_PLATFORM_WEBMOBILE));
        sleep(1);

        NotificationWebMobileEvent::dispatch($event?->order?->user?->tracking_code, $offerData);
    }
}
