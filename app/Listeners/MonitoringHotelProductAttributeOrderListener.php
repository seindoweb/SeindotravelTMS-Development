<?php

namespace App\Listeners;

use App\Constants\ModelConstant;
use App\Events\MonitoringHotelProductAttributeOrderEvent;
use App\Models\OrderProductAttribute;
use App\Services\HotelMicroserviceApi\IssueBooking as IssueBookingMg;
use App\Services\HotelMicroserviceApi\ReservationDetails;
use Illuminate\Support\Carbon;

class MonitoringHotelProductAttributeOrderListener
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
    public function handle(MonitoringHotelProductAttributeOrderEvent $event): void
    {
        $codeFailuresAndErrors = [ModelConstant::ORDER_STATUS_PROGRESS, ModelConstant::ORDER_STATUS_ABORTED, ModelConstant::ORDER_STATUS_EXPIRED, ModelConstant::ORDER_STATUS_FAILED, ModelConstant::ORDER_STATUS_CANCELED];

        if ($event?->orderProductAttribute?->order && $event?->orderProductAttribute?->order?->payment_status == ModelConstant::PAYMENT_STATUS_PAID) {

            // Issued immediately after payment
            if ($event->orderProductAttribute->order_status === ModelConstant::ORDER_STATUS_BOOKING || $event->orderProductAttribute->order_status === ModelConstant::ORDER_STATUS_EXPIRED) {

                // adding a condition for cases where there is more than one service provider
                $this->handleBookingToIssue($event->orderProductAttribute);
            } else {
                // Option if when issuing an error there is an error in taking the response.
                if (in_array($event->orderProductAttribute->order_status, $codeFailuresAndErrors) && $event->orderProductAttribute->is_retryable == true) {

                    // adding a condition for cases where there is more than one service provider
                    $this->handleReservationDetailsMg($event->orderProductAttribute);
                }
            }
        } else {
            if ($event->orderProductAttribute->order) {
                if (Carbon::parse($event->orderProductAttribute->order->expired_at)->isPast()) {

                    $event->orderProductAttribute->order_status = ModelConstant::ORDER_STATUS_EXPIRED;

                    if ($event->orderProductAttribute->save()) {
                        $event->orderProductAttribute->details->booking_status = ModelConstant::ORDER_STATUS_EXPIRED;

                        $event->orderProductAttribute->details->save();
                    }
                }
            } else {
                $event->orderProductAttribute->order_status = ModelConstant::ORDER_STATUS_FAILED;

                if ($event->orderProductAttribute->save()) {
                    $event->orderProductAttribute->details->booking_status = ModelConstant::BOOKING_STATUS_FAILED;

                    $event->orderProductAttribute->details->save();
                }
            }
        }
    }

    public function handleBookingToIssue(OrderProductAttribute $orderProductAttribute)
    {
        if ($orderProductAttribute->supplier_source === ModelConstant::ORDER_SUPPLIER_RESOURCE_MG) {
            $this->handleIssueBookingMg($orderProductAttribute);
        }
    }

    public function handleOrderStatusMg(string $order_status)
    {
        switch ($order_status) {
            case 'CONF':
                return ModelConstant::ORDER_STATUS_CONFIRMED;
            case 'RESERVED':
                return ModelConstant::ORDER_STATUS_PROGRESS;
            case 'NOTCONF':
                return ModelConstant::ORDER_STATUS_ABORTED;
            case 'CANCEL':
                return ModelConstant::ORDER_STATUS_CANCELED;
            case 'CANCELCONF':
                return ModelConstant::ORDER_STATUS_CANCELED;
            case 'CANCELCHARGE':
                return ModelConstant::ORDER_STATUS_CANCELED;
            default:
                return ModelConstant::ORDER_STATUS_BOOKING;
        }
    }

    public function handleIssueBookingMg(OrderProductAttribute $orderProductAttribute)
    {
        $reqHttp = [
            'sessionId' => $orderProductAttribute->details->session_id,
            'agencyBookingID' => $orderProductAttribute->code,
        ];

        $http = null;
        $dataCollectionCount = 0;
        $dataCollectionStatus = 'success';

        do {
            $http = IssueBookingMg::postIssueBooking($reqHttp);
            $dataCollectionStatus = $http['meta']['status'] ?? 'error';
            $dataCollectionCount++;
        } while ($dataCollectionCount < 1 && $dataCollectionStatus === 'error');

        if ($dataCollectionStatus === 'success') {
            if (isset($http['data']['results']['status'])) {
                $orderProductAttribute->order_status = $this->handleOrderStatusMg($http['data']['results']['status']);
                $orderProductAttribute->reference_id = $http['data']['results']['providerBookingId'];
                if ($orderProductAttribute->save()) {
                    $orderProductAttribute->details->booking_status = $http['data']['results']['status'];

                    $orderProductAttribute->details->save();
                }
            }
        } else {
            $errorMessage = $http['data']['errors']['general'] ?? $http['meta']['message'] ?? '';
            if (is_string($errorMessage) && (str_contains(strtolower($errorMessage), 'duplicate entry') || str_contains(strtolower($errorMessage), 'already'))) {
                $this->handleReservationDetailsMg($orderProductAttribute);

                return;
            }

            $orderProductAttribute->order_status = ModelConstant::ORDER_STATUS_FAILED;
            $orderProductAttribute->is_retryable = true;

            if ($orderProductAttribute->save()) {
                $orderProductAttribute->details->booking_status = ModelConstant::BOOKING_STATUS_CANCELED;

                $orderProductAttribute->details->save();
            }
        }
    }

    public function handleReservationDetailsMg(OrderProductAttribute $orderProductAttribute)
    {
        $reqHttp = [];

        if ($orderProductAttribute->reference_id != null) {
            $reqHttp['providerBookingID'] = $orderProductAttribute->reference_id;
        } else {
            $reqHttp['agencyBookingID'] = $orderProductAttribute->code;
        }

        $http = null;
        $dataCollectionCount = 0;
        $dataCollectionStatus = 'success';

        do {
            $http = ReservationDetails::getReservationDetails($reqHttp);
            $dataCollectionStatus = $http['meta']['status'];
            $dataCollectionCount++;
            sleep(3);
        } while ($dataCollectionCount < 3 && $dataCollectionStatus === 'error');

        if ($dataCollectionStatus === 'success') {
            if (isset($http['data']['results']['bookingDetails']['status'])) {
                $orderProductAttribute->order_status = $this->handleOrderStatusMg($http['data']['results']['bookingDetails']['status']);
                $orderProductAttribute->reference_id = $http['data']['results']['bookingDetails']['mgBookingID'];
                if ($orderProductAttribute->save()) {
                    $orderProductAttribute->details->booking_status = $http['data']['results']['bookingDetails']['status'];

                    $orderProductAttribute->details->save();
                }
            }
        }
    }
}
