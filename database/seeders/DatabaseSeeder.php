<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(WorldSqlSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(UserMoreSeeder::class);
        $this->call(RolePermissionSeeder::class);
        $this->call(ProductAttributesTableSeeder::class);
        $this->call(TravellerSeeder::class);


        $this->call(UserCreditsTableSeeder::class);
    }
}
