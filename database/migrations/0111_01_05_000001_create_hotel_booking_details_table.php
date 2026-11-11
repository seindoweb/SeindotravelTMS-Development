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
        Schema::create('hotel_booking_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('hotel_booking_id');
            $table->string('name');
            $table->string('code', 88);
            $table->string('rating', 8)->nullable();
            $table->text('address_main')->nullable();
            $table->text('address_alternative')->nullable();
            $table->string('area_name')->nullable();
            $table->string('destination_name');
            $table->string('country_name', 88);
            $table->string('zip_code', 88);
            $table->string('latitude', 88);
            $table->string('longitude', 88);

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
        Schema::dropIfExists('hotel_booking_details');
    }
};
