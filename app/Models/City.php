<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class City extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'cities';

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
     * Get the country that owns the city.
     */
    public function countries(): BelongsTo
    {
        return $this->belongsTo(Country::class, 'country_id', 'id');
    }

    /**
     * Get the state that owns the city.
     */
    public function states(): BelongsTo
    {
        return $this->belongsTo(State::class, 'state_id', 'id');
    }
}
