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
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();

            // Menghubungkan voucher dengan produk spesifik yang digunakan
            $table->unsignedBigInteger('product_attribute_id')->nullable();
            $table->string('image_path', 888)->nullable();

            // Aturan potongan voucher
            $table->enum('discount_type', ['percentage', 'fixed',]);
            $table->decimal('discount_value', 18, 2);
            $table->decimal('max_discount', 18, 2)->nullable();
            $table->decimal('min_order_amount', 18, 2)->default(0);

            // Periode berlaku
            $table->timestamp('start_at')->nullable();
            $table->timestamp('end_at')->nullable();

            // Distribusi voucher
            $table->enum('voucher_type', ['general', 'signup',])->default('general');
            $table->enum('distribution_type', ['public', 'personal',])->default('public');

            // Batas pemakaian total seluruh kode
            $table->unsignedInteger('usage_limit')->nullable();
            $table->unsignedInteger('usage_per_user')->nullable();
            $table->unsignedInteger('used_count')->default(0);

            $table->integer('platform')->default('0'); // 0 = All, 1 = Web, 2 = Mobile
            $table->enum('status', ['draft', 'active', 'inactive', 'expired', 'exhausted'])->default('draft')->index();

            $table->foreignId('created_by')->nullable()->constrained('users')->cascadeOnUpdate()->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->cascadeOnUpdate()->nullOnDelete();
            $table->timestamps();

            $table
                ->foreign('product_attribute_id')
                ->references('id')
                ->on('product_attributes')
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
        Schema::dropIfExists('vouchers');
    }
};
