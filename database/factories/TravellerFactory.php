<?php

namespace Database\Factories;

use App\Models\Traveller;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Traveller>
 */
class TravellerFactory extends Factory
{
    protected $model = Traveller::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $countriesByContinent = [
            'Asia' => [
                'ID' => ['document' => 'KTP'],
                'MY' => ['document' => 'MYKAD'],
                'SG' => ['document' => 'NRIC'],
                'TH' => ['document' => 'NATIONAL_ID'],
                'PH' => ['document' => 'NATIONAL_ID'],
                'VN' => ['document' => 'NATIONAL_ID'],
                'JP' => ['document' => 'MY_NUMBER_CARD'],
                'KR' => ['document' => 'RRN'],
                'CN' => ['document' => 'NATIONAL_ID'],
                'IN' => ['document' => 'AADHAAR'],
            ],

            'Europe' => [
                'GB' => ['document' => 'NATIONAL_ID'],
                'FR' => ['document' => 'NATIONAL_ID'],
                'DE' => ['document' => 'PERSONALAUSWEIS'],
                'IT' => ['document' => 'NATIONAL_ID'],
                'ES' => ['document' => 'DNI'],
                'NL' => ['document' => 'ID_CARD'],
                'CH' => ['document' => 'ID_CARD'],
            ],

            'Africa' => [
                'ZA' => ['document' => 'NATIONAL_ID'],
                'EG' => ['document' => 'NATIONAL_ID'],
                'NG' => ['document' => 'NIN'],
                'KE' => ['document' => 'NATIONAL_ID'],
                'MA' => ['document' => 'NATIONAL_ID'],
            ],

            'North America' => [
                'US' => ['document' => 'STATE_ID'],
                'CA' => ['document' => 'PROVINCIAL_ID'],
                'MX' => ['document' => 'CURP'],
                'CR' => ['document' => 'CÉDULA'],
            ],

            'South America' => [
                'BR' => ['document' => 'RG'],
                'AR' => ['document' => 'DNI'],
                'CL' => ['document' => 'RUN'],
                'CO' => ['document' => 'CÉDULA'],
                'PE' => ['document' => 'DNI'],
            ],

            'Oceania' => [
                'AU' => ['document' => 'DRIVER_LICENCE'],
                'NZ' => ['document' => 'KIWIS_ACCESS'],
                'FJ' => ['document' => 'NATIONAL_ID'],
            ],
        ];

        $continent = fake()->randomElement(
            array_keys($countriesByContinent)
        );

        $country = fake()->randomElement(
            array_keys($countriesByContinent[$continent])
        );

        $documentType =
            $countriesByContinent[$continent][$country]['document'];

        $firstName = fake()->firstName();
        $lastName = fake()->lastName();

        $dateOfBirth = fake()->dateTimeBetween(
            '-60 years',
            '-18 years'
        );

        $documentIssueDate = fake()->dateTimeBetween(
            '-5 years',
            '-1 year'
        );

        return [
            'user_id' => User::factory(),

            'title' => fake()->randomElement([
                'Mr',
                'Mrs',
                'Ms',
                'Miss',
            ]),

            'first_name' => $firstName,
            'last_name' => $lastName,
            'date_of_birth' => $dateOfBirth->format('Y-m-d'),

            'nationality' => $country,

            // Identitas nasional dummy
            'document_type' => $documentType,
            'document_number' => strtoupper(fake()->unique()->bothify('??##########')),
            'issuing_country' => $country,

            'document_issue_date' => $documentIssueDate->format('Y-m-d'),

            // Tanggal kedaluwarsa identitas dummy
            'document_expiry_date' => fake()->dateTimeBetween(
                '+1 year',
                '+8 years'
            )->format('Y-m-d'),

            // Data paspor dummy
            'passport_number' => strtoupper(
                fake()->unique()->bothify('??######')
            ),
            'passport_issuing_country' => $country,
            'passport_issue_date' => $documentIssueDate->format('Y-m-d'),
            'passport_expiry_date' => fake()->dateTimeBetween(
                '+1 year',
                '+5 years'
            )->format('Y-m-d'),

            'created_by' => null,
            'updated_by' => null,
        ];
    }
}
