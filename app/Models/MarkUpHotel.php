<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Services\Systems\CreatorAndUpdater;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MarkUpHotel extends Model
{
    use CreatorAndUpdater, HasFactory;

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array<string>|bool
     */
    protected $guarded = [];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

}
