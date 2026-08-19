<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class Region extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'regions';

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
     * Get the subregions for the region.
     */
    public function subregions(): HasMany
    {
        return $this->hasMany(Subregion::class, 'region_id', 'id');
    }

    /**
     * Get the countries for the region.
     */
    public function countries(): HasMany
    {
        return $this->hasMany(Country::class, 'region_id', 'id');
    }
}
