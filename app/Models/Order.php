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
use Illuminate\Support\Str;

class Order extends Model
{
    use LogsActivity, CreatorAndUpdater, HasFactory;

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array<string>|bool
     */
    protected $guarded = [];

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::creating(function (Order $order) {

            if (!empty($order->invoice_number)) {
                return;
            }

            // Prefix tanggal mengikuti tanggal saat ini
            $prefix = now()->format('Ymd') . '-';

            // Ambil nomor urut terbesar dari seluruh invoice
            $lastNumber = static::query()
                ->selectRaw("
                    COALESCE(
                        MAX(CAST(SUBSTRING_INDEX(invoice_number, '-', -1) AS UNSIGNED)),
                        0
                    ) AS last_number
                ")
                ->value('last_number');

            // Nomor urut selalu bertambah
            $nextNumber = ((int) $lastNumber) + 1;

            $order->invoice_number = $prefix . str_pad(
                (string) $nextNumber,
                4,
                '0',
                STR_PAD_LEFT
            );
        });
    }

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
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function orderProductAttributes(): HasMany
    {
        return $this->hasMany(OrderProductAttribute::class, 'order_id', 'id');
    }
}
