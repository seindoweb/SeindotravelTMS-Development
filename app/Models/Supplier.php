<?php

namespace App\Models;

use App\Services\Systems\TriadIdMask;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

class Supplier extends Model
{
    use HasFactory, LogsActivity;

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
    protected $appends = ['index', 'key', 'name_initials'];

    public function getIndexAttribute()
    {
        return TriadIdMask::encode($this->id);
    }

    public function getKeyAttribute()
    {
        return Crypt::encryptString($this->id);
    }

    public function getNameInitialsAttribute()
    {
        return Str::substr($this->name, 0, 1);
    }

    /**
     * getActivitylogOptions
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
