<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number', 88)->unique();
            $table->unsignedBigInteger('user_id')->nullable();

            // Menghubungkan transaksi/klaim dengan kode voucher spesifik yang digunakan
            $table->unsignedBigInteger('voucher_code_id')->nullable();

            // Mata uang dasar perusahaan
            $table->char('base_currency_code', 3)->nullable()->default('IDR');
            // Nilai dalam mata uang dasar dalam perusahaan
            $table->decimal('subtotal_base_amount', 18, 2)->nullable()->default(0);
            $table->decimal('discount_base_amount', 18, 2)->nullable()->default(0);
            $table->decimal('tax_base_amount', 18, 2)->nullable()->default(0);
            $table->decimal('total_base_amount', 18, 2)->nullable()->default(0);

            // Mata uang transaksi
            $table->char('currency_code', 3)->nullable()->default('IDR');
            // Kurs transaksi ke base currency
            $table->decimal('exchange_rate', 18, 6)->nullable()->default(1);
            // Nilai dalam mata uang transaksi
            $table->decimal('subtotal_amount', 18, 2)->nullable()->default(0);
            $table->decimal('discount_amount', 18, 2)->nullable()->default(0);
            $table->decimal('tax_amount', 18, 2)->nullable()->default(0);
            $table->decimal('total_amount', 18, 2)->nullable()->default(0);

            $table->string('type_of_payment')->comment('CH, TF, PG, SC');
            $table->string('payment_status', 36);
            $table->text('payment_url')->nullable();
            $table->string('system', 88);
            $table->datetime('expired_at');
            $table->foreignId('created_by')->nullable()->constrained('users')->cascadeOnUpdate()->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->cascadeOnUpdate()->nullOnDelete();
            $table->timestamps();

            $table
                ->foreign('user_id')
                ->references('id')
                ->on('users')
                ->constrained()
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table
                ->foreign('voucher_code_id')
                ->references('id')
                ->on('voucher_codes')
                ->constrained()
                ->cascadeOnUpdate()
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
