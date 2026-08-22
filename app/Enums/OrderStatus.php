<?php


namespace App\Enums;

enum OrderStatus: string
{
    case BOOKING = 'B';
    case CONFIRMED = 'C';
    case DONE = 'D';
    case FAILED = 'F';
    case UNKNOWN = '';

    public function label(): string
    {
        return match ($this) {
            self::BOOKING => 'booking',
            self::CONFIRMED => 'confirmed',
            self::DONE => 'done',
            self::FAILED => 'failed',
            self::UNKNOWN => 'unknown',
        };
    }
}
