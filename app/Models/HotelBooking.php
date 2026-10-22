<?php

namespace App\Models;

use App\Services\Systems\CreatorAndUpdater;
use App\Services\Systems\TriadIdMask;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Crypt;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

class HotelBooking extends Model
{
    use LogsActivity, CreatorAndUpdater, HasFactory;

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array<string>|bool
     */
    protected $guarded = [];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['index', 'key'];

    public function getIndexAttribute()
    {
        return TriadIdMask::encode($this->id);
    }

    public function getKeyAttribute()
    {
        return Crypt::encryptString($this->id); // atau logika dinamis
    }

    /**
     * getActivitylogOptions
     *
     * @return LogOptions
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()              // log semua attribute
            ->logOnlyDirty();        // hanya yang berubah
    }

    /**
     * Retrieves all tables related to hotel_bookings.
     */
    public function orderProductAttribute(): BelongsTo
    {
        return $this->belongsTo(OrderProductAttribute::class, 'order_prod_attr_id', 'id');
    }

    public function hotelBookingRoomDetails(): HasMany
    {
        return $this->hasMany(HotelBookingRoomDetails::class, 'hotel_booking_id', 'id');
    }

    public function hotelBookingRooms(): HasMany
    {
        return $this->hasMany(HotelBookingRoom::class, 'hotel_booking_id', 'id');
    }
}
