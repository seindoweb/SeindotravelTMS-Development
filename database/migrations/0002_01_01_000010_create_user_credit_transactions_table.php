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
        Schema::create('user_credit_transactions', function (Blueprint $table) {
            $table->id();
            $table->enum('type', [
                'deposit',
                'credit',  // → saldo bertambah
                'debit',   // → saldo berkurang
                'booking',
                'adjustment',
            ]);

            $table->unsignedBigInteger('user_credit_id');
            $table->decimal('amount', 18, 2);
            $table->decimal('used_before', 18, 2);
            $table->decimal('used_after', 18, 2);
            $table->string('source')->nullable();
            $table->nullableMorphs('reference');
            $table->text('description')->nullable();
            $table->timestamps();
            $table->foreignId('created_by')->nullable()->constrained('users')->cascadeOnUpdate()->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->cascadeOnUpdate()->nullOnDelete();
            $table->foreign('user_credit_id')->references('id')->on('user_credits')->cascadeOnUpdate()->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_credit_transactions');
    }

    /**
     * Contoh penggunaan.
     *
     * Customer booking gagal
     * ----------------------
     * Customer punya:
     * Kredit = Rp0
     *
     * -> Booking Rp3.000.000 gagal.
     * Buat transaksi:
     *
     * User Credit Transaction
     * type            = credit
     * amount          = 3_000_000
     * balance_before  = 0
     * balance_after   = 3_000_000
     * source          = booking_failed
     *
     * Hasil:
     * Kredit = Rp3.000.000
     * Sehingga Tidak perlu menggunakan istilah refund.
     *
     * Customer booking lagi
     * ----------------------
     * Customer punya:
     * Kredit = Rp3.000.000
     *
     * -> Booking Rp1.500.000 berhasil.
     * Buat transaksi:
     *
     * User Credit Transaction
     * type            = credit
     * amount          = 1_500_000
     * balance_before  = 3_000_000
     * balance_after   = 1_500_000
     * source          = booking
     *
     */
};
