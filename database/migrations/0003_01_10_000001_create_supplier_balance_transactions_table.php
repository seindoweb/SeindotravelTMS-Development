<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Mapping transaction_type dan reference_type :
     * Type	            Reference Type              Keterangan	                        Pengaruh Saldo
     * initial	        opening_balance             Saldo awal	                                +
     * topup	        manual                      Penambahan deposit	                        +
     * usage	        booking                     Pemakaian deposit untuk booking	            -
     * refund	        booking_cancellation        Pengembalian dana dari supplier	            +
     * refund	        booking_refund	            Pengembalian dana dari supplier             +
     * adjustment_in	manual                      Koreksi penambahan saldo	                +
     * adjustment_out	manual                      Koreksi pengurangan saldo	                -
     */
    public function up(): void
    {
        Schema::create('supplier_balance_transactions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('supplier_balance_id')->nullable();
            $table->string('supplier_resource_code');
            $table->string('transaction_type', 30);
            $table->string('reference_type', 30);
            $table->string('reference_id', 100)->nullable();
            $table->text('description')->nullable();
            $table->decimal('amount', 18, 2);
            $table->decimal('balance_before', 18, 2);
            $table->decimal('balance_after', 18, 2);
            $table->dateTime('transaction_date');


            $table->foreignId('created_by')->nullable()->constrained('users')->cascadeOnUpdate()->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->cascadeOnUpdate()->nullOnDelete();
            $table->timestamps();
            $table
                ->foreign('supplier_balance_id')
                ->references('id')
                ->on('supplier_balances')
                ->constrained()
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->index(
                ['supplier_balance_id', 'transaction_date'],
                'supplier_balance_transaction_date_index'
            );

            $table->index(
                ['reference_type', 'reference_id'],
                'supplier_balance_reference_index'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('supplier_balance_transactions');
    }
};
