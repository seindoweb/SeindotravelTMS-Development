<?php

namespace App\Enums;

enum PaymentType: string
{
    case CASH = 'CH';
    case TRANSFER_BANK = 'TF';
    case PAYMENT_GATEWAY = 'PG';
    case USER_CREDIT = 'UC';

    public function label(): string
    {
        return match ($this) {
            self::CASH => 'CASH',
            self::TRANSFER_BANK => 'Transfer Bank',
            self::PAYMENT_GATEWAY => 'Payment Gateways',
            self::USER_CREDIT => 'User Credit',
        };
    }
}
