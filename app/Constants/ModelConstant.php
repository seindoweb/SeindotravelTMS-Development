<?php

namespace App\Constants;

final class ModelConstant
{
    //PRODUCT ATTRIBUTE
    public const PRODUCT_ATTRIBUTE_FLIGHT = "flight";
    public const PRODUCT_ATTRIBUTE_HOTEL = "hotel";
    public const PRODUCT_ATTRIBUTE_EVENT = "event";
    public const PRODUCT_ATTRIBUTE_TOUR = "tour";

    // ORDER STATUS
    public const ORDER_STATUS_BOOKING = 'B';
    public const ORDER_STATUS_PROGRESS = 'P';
    public const ORDER_STATUS_CONFIRMED = 'C';
    public const ORDER_STATUS_DONE = 'D';
    public const ORDER_STATUS_FAILED = 'F';
    public const ORDER_STATUS_ABORTED = 'A';
    public const ORDER_STATUS_EXPIRED = 'E';
    public const ORDER_STATUS_CANCELED = 'X';

    // RESOURCE PROVIDER
    public const ORDER_SUPPLIER_RESOURCE_MG = 'MG';
    public const ORDER_SUPPLIER_RESOURCE_VIA = 'VIA';

    // PAYMENT STATUS
    public const PAYMENT_STATUS_UNPAID = 'unpaid';
    public const PAYMENT_STATUS_PENDING = 'pending';
    public const PAYMENT_STATUS_PARTIALLY = 'partially';
    public const PAYMENT_STATUS_PAID = 'paid';
    public const PAYMENT_STATUS_EXPIRED = 'expired';
    public const PAYMENT_STATUS_FAILED = 'failed';

    // PAYMENT TYPE
    public const PAYMENT_TYPE_CASH = 'CH';
    public const PAYMENT_TYPE_TRANSFER_BANK = 'TF';
    public const PAYMENT_TYPE_PAYMENT_GATEWAY = 'PG';
    public const PAYMENT_TYPE_USER_CREDIT = 'UC';

    // BOOKING STATUS
    public const BOOKING_STATUS_EXPIRED = 'EXPIRED';
    public const BOOKING_STATUS_FAILED = 'FAILED';
    public const BOOKING_STATUS_CANCELED    = 'CANCELED';
}
