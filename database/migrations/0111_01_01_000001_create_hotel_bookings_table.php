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
        Schema::create('hotel_bookings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_prod_attr_id')->nullable();
            $table->string('session_id')->unique();
            $table->string('booking_status');
            $table->string('country', 8);
            $table->string('destination', 88);
            $table->string('hotel', 88);
            $table->date('check_in');
            $table->date('check_out');
            $table->string('pic_guest_nationality', 8)->comment('nationality');
            $table->timestamps();
            $table->foreignId('created_by')->nullable()->constrained('users')->cascadeOnUpdate()->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->cascadeOnUpdate()->nullOnDelete();


            $table
                ->foreign('order_prod_attr_id')
                ->references('id')
                ->on('order_product_attributes')
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
        Schema::dropIfExists('hotel_bookings');
    }
};
