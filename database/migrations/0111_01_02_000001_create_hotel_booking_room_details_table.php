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
        Schema::create('hotel_booking_room_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('hotel_booking_id');
            $table->string('code', 100);
            $table->string('name');
            $table->string('meal_plan_code', 50);
            $table->string('meal_plan_name');
            $table->string('cancellation_policy_type', 50);
            $table->boolean('package_rate')->default(false);
            $table->decimal('msp', 18, 2)->default(0);
            $table->decimal('gross_price', 18, 2)->default(0);
            $table->decimal('nta_price', 18, 2)->default(0);
            $table->decimal('nta_price_per_night', 18, 2)->default(0);
            $table->decimal('markup_price', 18, 2)->default(0);
            $table->decimal('markup_price_per_night', 18, 2)->default(0);
            $table->decimal('selling_price', 18, 2)->default(0);
            $table->decimal('selling_price_per_night', 18, 2)->default(0);
            $table->text('message')->nullable();
            $table->timestamps();

            $table
                ->foreign('hotel_booking_id')
                ->references('id')
                ->on('hotel_bookings')
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
        Schema::dropIfExists('hotel_booking_room_details');
    }
};
