<?php

namespace App\Constants;

final class ModelConstant
{
    // PAYMENT STATUS
    public const PAYMENT_STATUS_UNPAID = 'unpaid';
    public const PAYMENT_STATUS_PENDING = 'pending';
    public const PAYMENT_STATUS_PARTIALLY = 'partially';
    public const PAYMENT_STATUS_PAID = 'paid';
    public const PAYMENT_STATUS_EXPIRED = 'expired';
    public const PAYMENT_STATUS_FAILED = 'failed';

    // ORDER STATUS
    public const ORDER_STATUS_BOOKING = 'B';
    public const ORDER_STATUS_CONFIRMED = 'C';
    public const ORDER_STATUS_DONE = 'D';
    public const ORDER_STATUS_FAILED = 'F';

    // PAYMENT TYPE
    public const PAYMENT_TYPE_CASH = 'CH';
    public const PAYMENT_TYPE_TRANSFER_BANK = 'TF';
    public const PAYMENT_TYPE_PAYMENT_GATEWAY = 'PG';
    public const PAYMENT_TYPE_SEINDO_CREDITS = 'SC';
}
