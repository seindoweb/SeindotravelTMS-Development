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
        Schema::create('hotel_booking_rooms', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('hotel_booking_id');
            $table->string('room_no');
            $table->string('no_of_adults')->default("1");
            $table->string('no_of_child')->nullable()->default("");

            $table->string('child1_age')->nullable()->default("");
            $table->string('child2_age')->nullable()->default("");

            $table->boolean('extra_bed')->default(false);
            $table->string('rate_key');
            $table->timestamps();

            $table->index(['hotel_booking_id', 'room_no']);
            $table->foreign('hotel_booking_id')
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
        Schema::dropIfExists('hotel_booking_rooms');
    }
};
