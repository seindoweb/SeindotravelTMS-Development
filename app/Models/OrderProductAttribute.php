<?php

namespace App\Models;

use App\Services\Systems\CreatorAndUpdater;
use App\Services\Systems\TriadIdMask;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Crypt;

class OrderProductAttribute extends Model
{
    use CreatorAndUpdater, HasFactory;

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
     * Retrieves all tables related to order_product_attributes.
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'order_id', 'id');
    }

    public function productAttribute(): BelongsTo
    {
        return $this->belongsTo(ProductAttribute::class, 'product_attribute_id', 'id');
    }

    /**
     * Get details if from the orders table associated with the order_product_attribute.
     */
    public function details()
    {
        // Retrieve the related ProductAttribute
        $productAttribute = $this->productAttributes;

        // Check if a related ProductAttribute exists
        if ($productAttribute) {

            /**
             * Get the car_schedules associated with the order_product_attributes.
             */

            if ($productAttribute->model === "HotelBooking") {

                // Use dynamic model relationship to retrieve the related model
                return $this->hasOne(HotelBooking::class, 'order_prod_attr_id', 'id');
            }
        } else {
            return null; // or handle the case where no associated ProductAttribute is found
        }
    }
}
