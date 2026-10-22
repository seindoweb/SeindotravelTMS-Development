<?php

namespace Database\Seeders;

use App\Models\Traveller;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

class TravellerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (User::query()->doesntExist()) {
            User::factory()->count(5)->create();
        }

        User::query()
            ->select('id')
            ->orderBy('id')
            ->each(function (User $user) {
                Traveller::factory()
                    ->count(Arr::random(range(8, 18)))
                    ->create([
                        'user_id' => $user->id,
                        'created_by' => $user->id,
                        'updated_by' => $user->id,
                    ]);
            });
    }
}
