<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class VouchersTableSeeder extends Seeder
{
    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {

        \DB::table('vouchers')->delete();

        \DB::table('vouchers')->insert([
            0 => [
                'id' => 1,
                'name' => 'Seindo Travel Bagi-bagi Hadiah 50k untuk 100 Orang',
                'product_attribute_id' => 1,
                'image_path' => 'vouchers/lqyN11SI5CbtCvHMaOegyUkEEqZAuJaOFwX5dgxq.jpg',
                'discount_type' => 'fixed',
                'discount_value' => '50000.00',
                'max_discount' => null,
                'min_order_amount' => '0.00',
                'start_at' => '2026-12-12 00:00:00',
                'end_at' => '2027-12-12 00:00:00',
                'voucher_type' => 'general',
                'distribution_type' => 'public',
                'usage_limit' => 100,
                'usage_per_user' => 1,
                'used_count' => 0,
                'platform' => 0,
                'status' => 'draft',
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => '2026-11-23 14:25:31',
                'updated_at' => '2026-11-23 14:25:31',
            ],
        ]);

    }
}
