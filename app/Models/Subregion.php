<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class Subregion extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'subregions';

    protected $appends = ['key'];

    public function getKeyAttribute()
    {
        return Crypt::encryptString($this->id);
    }

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * Get the region that owns the subregion.
     */
    public function regions(): BelongsTo
    {
        return $this->belongsTo(Region::class, 'region_id', 'id');
    }

    /**
     * Get the countries for the subregion.
     */
    public function countries(): HasMany
    {
        return $this->hasMany(Country::class, 'subregion_id', 'id');
    }
}
