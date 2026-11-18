<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class SuppliersTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('suppliers')->delete();
        
        \DB::table('suppliers')->insert(array (
            0 => 
            array (
                'id' => 1,
                'code' => 'MG',
                'name' => 'MG Bedbank',
                'created_at' => '2008-08-08 08:08:08',
                'updated_at' => '2008-08-08 08:08:08',
            ),
            1 => 
            array (
                'id' => 2,
                'code' => 'VIA',
                'name' => 'Via.com',
                'created_at' => '2008-08-08 08:08:08',
                'updated_at' => '2008-08-08 08:08:08',
            ),
        ));
        
        
    }
}