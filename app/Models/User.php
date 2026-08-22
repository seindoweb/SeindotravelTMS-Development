<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Services\Systems\TriadIdMask;
use Illuminate\Support\Facades\Crypt;
use App\Services\Systems\CreatorAndUpdater;
use Database\Factories\UserFactory;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Support\Str;

#[Fillable([
    'title',
    'full_name',
    'email',
    'password',
    'dial_code',
    'phone_number',
    'identity_type',
    'identity_number',
    'gender',
    'place_of_birth',
    'date_of_birth',
    'referral_code',
    'has_credit',
    'is_agent',
    'upline_id',
    'country_id',
    'state_id',
    'city_id',
    'address',
    'zip_code',
    'locale',
    'currency',
    'profile_photo_path',
    'active',
    'created_by',
    'updated_by',
])]
#[Hidden(['password', 'password_reset_otp', 'remember_token'])]

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasRoles, HasApiTokens, Notifiable, LogsActivity, CreatorAndUpdater;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'date_of_birth' => 'date',
            'password_reset_otp_expires_at' => 'datetime',
            'password' => 'hashed',
            'has_credit' => 'boolean',
            'is_agent' => 'boolean',
            'active' => 'boolean',
        ];
    }

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::creating(function (User $user) {
            do {
                $user->referral_code  = Str::upper(Str::random(8));
            } while (User::query()->where('referral_code', $user->referral_code)->exists());
        });
    }

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['profile_photo_path', 'index', 'key'];

    public function getProfilePhotoPathAttribute()
    {
        if (isset($this->attributes['profile_photo_path']) && $this->attributes['profile_photo_path']) {
            return $this->attributes['profile_photo_path'];
        }

        return 'https://avatars.mantapbacklink.com/api?format=svg&name=' . $this->full_name . '&format=svg&bold=false&rounded=true&size=320&background=Eb2E34&color=ffffff';
    }


    public function getIndexAttribute()
    {
        return TriadIdMask::encode($this->id);
    }

    public function getKeyAttribute()
    {
        return Crypt::encryptString($this->id);
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
     * Get all users under this customer/user.
     */
    public function downlines(): HasMany
    {
        return $this->hasMany(User::class, 'upline_id');
    }

    /**
     * Upline/agent of this customer.
     */
    public function upline(): BelongsTo
    {
        return $this->belongsTo(User::class, 'upline_id');
    }
}
