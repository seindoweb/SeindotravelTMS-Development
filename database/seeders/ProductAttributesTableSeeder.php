<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ProductAttributesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        \DB::table('product_attributes')->delete();

        \DB::table('product_attributes')->insert([
            [
                'id' => 1,
                'attribute' => 'hotel',
                'model' => 'Hotel',
                'product' => 'Hotel',
                'created_at' => '2008-08-08 08:08:08',
                'updated_at' => '2008-08-08 08:08:08',
            ],
            [
                'id' => 2,
                'attribute' => 'flight',
                'model' => 'Flight',
                'product' => 'Flight',
                'created_at' => '2008-08-08 08:08:08',
                'updated_at' => '2008-08-08 08:08:08',
            ],
            [
                'id' => 3,
                'attribute' => 'tour',
                'model' => 'Tour',
                'product' => 'Tour',
                'created_at' => '2008-08-08 08:08:08',
                'updated_at' => '2008-08-08 08:08:08',
            ],
        ]);
    }
}
