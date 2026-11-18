<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Services\Systems\TriadIdMask;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Crypt;

class Supplier extends Model
{
    use LogsActivity, HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'code',
        'name',
    ];

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
     * Retrieves all tables related to order_product_attributes.
     */
    public function supplierBalance(): HasOne
    {
        return $this->hasOne(SupplierBalance::class, 'SupplierBalance', 'id');
    }
}
