<?php

namespace App\Constants;

final class SupplierAndBalanceConstant
{
    // Balance Type
    public const TYPE_PREPAID = 'prepaid';

    public const TYPE_POSTPAID = 'postpaid';

    // Transaction Type
    public const TRANSACTION_INITIAL = 'initial';

    public const TRANSACTION_TOPUP = 'topup';

    public const TRANSACTION_USAGE = 'usage';

    public const TRANSACTION_REFUND = 'refund';

    public const TRANSACTION_PAYMENT = 'payment';

    public const TRANSACTION_ADJUSTMENT_IN = 'adjustment_in';

    public const TRANSACTION_ADJUSTMENT_OUT = 'adjustment_out';

    // Reference Type
    public const REFERENCE_OPENING_BALANCE = 'opening_balance';

    public const REFERENCE_MANUAL = 'manual';

    public const REFERENCE_BOOKING = 'booking';

    public const REFERENCE_BOOKING_CANCELLATION = 'booking_cancellation';

    public const REFERENCE_BOOKING_REFUND = 'booking_refund';

    public const REFERENCE_CREDIT_PAYMENT = 'credit_payment';

    // Direction
    public const DIRECTION_CREDIT = 'credit';

    public const DIRECTION_DEBIT = 'debit';
}
