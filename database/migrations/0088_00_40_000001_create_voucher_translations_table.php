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
        Schema::create('voucher_translations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('voucher_id');

            $table->string('locale', 10);
            $table->text('description')->nullable();

            $table->timestamps();
            $table->foreignId('created_by')->nullable()->constrained('users')->cascadeOnUpdate()->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->cascadeOnUpdate()->nullOnDelete();

            $table->unique(['voucher_id', 'locale']);
            $table
                ->foreign('voucher_id')
                ->references('id')
                ->on('vouchers')
                ->constrained()
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('voucher_translations');
    }
};
