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
        Schema::create('supplier_balances', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('supplier_id')->nullable();
            $table->char('currency_code', 3)->nullable()->default('IDR');
            $table->string('balance_type', 20);

            $table->decimal('initial_balance', 18, 2);
            $table->decimal('current_balance', 18, 2);
            $table->boolean('is_active')->default(true);

            $table->timestamps();

            $table
                ->foreign('supplier_id')
                ->references('id')
                ->on('suppliers')
                ->constrained()
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->unique(
                ['supplier_id', 'currency_code', 'balance_type'],
                'supplier_balance_unique'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('supplier_balances');
    }
};
