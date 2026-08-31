<?php

namespace Database\Factories;

use App\Models\Country;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        // 1. Determine the identity type randomly first.
        $identityType = fake()->randomElement(['KTP', 'Passport', 'SIM']);

        // 2. Generate an identification number based on the type.
        $identityNumber = match ($identityType) {
            'KTP'      => fake()->unique()->numerify('3171################'), // The unique 16-digit number of an Indonesian ID card (KTP)
            'Passport' => fake()->unique()->regexify('[A-Z]{1}[0-9]{7}'),     // 1 uppercase letter followed by 7 digits (Example: B1234567)
            'SIM'      => fake()->unique()->numerify('################'),     // New 16-digit driver's license number
        };

        $country = Country::query()
            ->whereHas('states.cities')
            ->inRandomOrder()
            ->first();

        $state = $country->states()
            ->whereHas('cities')
            ->inRandomOrder()
            ->first();

        $city = $state->cities()
            ->inRandomOrder()
            ->first();


        return [
            'title' => fake()->title(),
            'full_name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'dial_code'   => fake()->regexify('\+[1-9]{1,3}'),
            'phone_number' => fake()->numerify('8##########'),
            'identity_type'   => $identityType,
            'identity_number' => $identityNumber,
            'gender' => fake()->randomElement(['Male', 'Female', 'Rather not say', 'Custom']),
            'place_of_birth' => fake()->country(),
            'date_of_birth' => fake()->dateTimeBetween('-65 years', '-18 years')->format('Y-m-d'),
            'tracking_code' => fake()->unique()->numerify('8##########'),
            'upline_id' => 1,
            'country_id' => $country->id,
            'state_id' => $state->id ?? null,
            'city_id' => $city->id ?? null,
            'address' => fake()->streetAddress(),
            'zip_code' => fake()->postcode(),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
