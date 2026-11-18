<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Services\Systems\CreatorAndUpdater;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\Systems\TriadIdMask;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Crypt;

class SupplierBalanceTransaction extends Model
{
    use LogsActivity, CreatorAndUpdater, HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'supplier_balance_id',
        'supplier_resource_code',
        'transaction_type',
        'reference_type',
        'reference_id',
        'description',
        'amount',
        'balance_before',
        'balance_after',
        'transaction_date',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'balance_before' => 'decimal:2',
            'balance_after' => 'decimal:2',
            'transaction_date' => 'datetime',
        ];
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
     * Retrieves all tables related to supplier_balances.
     */
    public function supplierBalance(): BelongsTo
    {
        return $this->belongsTo(SupplierBalance::class, 'supplier_balance_id', 'id');
    }
}
