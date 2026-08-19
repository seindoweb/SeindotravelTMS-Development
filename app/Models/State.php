<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class State extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'states';

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
     * Get the country that owns the state.
     */
    public function countries(): BelongsTo
    {
        return $this->belongsTo(Country::class, 'country_id', 'id');
    }

    /**
     * Get the cities for the state.
     */
    public function cities(): HasMany
    {
        return $this->hasMany(City::class, 'state_id', 'id');
    }
}
