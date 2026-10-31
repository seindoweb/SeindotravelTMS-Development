<?php

namespace App\Enums;

enum OrderStatus: string
{
    case BOOKING = 'B';
    case CONFIRMED = 'C';
    case PROGRESS = 'P';
    case DONE = 'D';
    case ABORTED = 'A';
    case FAILED = 'F';
    case EXPIRED = 'E';
    case UNKNOWN = '';

    public function label(): string
    {
        return match ($this) {
            self::BOOKING => 'Booking',
            self::CONFIRMED => 'Confirmed',
            self::PROGRESS => 'In Progress',
            self::DONE => 'Done',
            self::ABORTED => 'Aborted',
            self::FAILED => 'Failed',
            self::EXPIRED => 'Expired',
            self::UNKNOWN => 'Unknown',
        };
    }

    public static function options(): array
    {
        return array_map(
            fn(self $status) => [
                'value' => $status->value,
                'label' => $status->label()
            ],
            self::cases()
        );
    }
}
