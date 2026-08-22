<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('users')->delete();
        
        \DB::table('users')->insert(array (
            0 => 
            array (
                'id' => 1,
                'title' => NULL,
                'full_name' => 'IT Seindo',
                'email' => 'it.seindo@gmail.com',
                'email_verified_at' => NULL,
                'password' => '$2y$12$m5xBfE.nj1e1iZo4q1yAzOGkA8C3i6TCSfNFHux7aFVzYWxGxq376',
                'dial_code' => '+62',
                'phone_number' => '85277230961',
                'identity_type' => NULL,
                'identity_number' => NULL,
                'gender' => NULL,
                'place_of_birth' => 'Indonesia',
                'date_of_birth' => '2008-08-08',
                'referral_code' => '1T531ND0',
                'has_credit' => 0,
                'is_agent' => 0,
                'upline_id' => NULL,
                'country_id' => NULL,
                'state_id' => NULL,
                'city_id' => NULL,
                'address' => NULL,
                'zip_code' => NULL,
                'locale' => 'id',
                'currency' => 'USD',
                'profile_photo_path' => NULL,
                'active' => 1,
                'remember_token' => NULL,
                'created_at' => '2026-08-18 09:02:48',
                'updated_at' => '2026-08-21 03:48:22',
                'deleted_at' => NULL,
                'created_by' => NULL,
                'updated_by' => 1,
            ),
        ));
        
        
    }
}