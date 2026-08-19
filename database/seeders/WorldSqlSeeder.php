<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WorldSqlSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $path = database_path('factories/WorldFactory.sql.gz');

        DB::statement('SET FOREIGN_KEY_CHECKS=0');

        $handle = gzopen($path, 'r');
        if (!$handle) {
            throw new \Exception('Gagal membuka file gzip');
        }

        $buffer = '';
        while (!gzeof($handle)) {
            $buffer .= gzgets($handle);

            // eksekusi per statement
            if (str_ends_with(trim($buffer), ';')) {
                DB::unprepared($buffer);
                $buffer = '';
            }
        }

        gzclose($handle);

        DB::statement('SET FOREIGN_KEY_CHECKS=1');
    }
}
