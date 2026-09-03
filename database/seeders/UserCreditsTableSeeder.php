<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class UserCreditsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('user_credits')->delete();
        
        \DB::table('user_credits')->insert(array (
            0 => 
            array (
                'id' => 1,
                'user_id' => 1,
                'balance' => '0.00',
                'currency' => 'IDR',
                'is_active' => 1,
                'created_at' => '2026-09-01 10:26:21',
                'updated_at' => '2026-09-01 10:26:21',
                'created_by' => 1,
                'updated_by' => 1,
            ),
        ));
        
        
    }
}