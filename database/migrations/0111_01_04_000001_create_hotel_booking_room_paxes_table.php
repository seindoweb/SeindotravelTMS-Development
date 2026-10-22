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
        Schema::create('hotel_booking_room_paxes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('hotel_booking_room_id');
            $table->string('salutation', 20)->nullable();
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->string('age')->nullable()->default("");
            $table->timestamps();
            $table->foreign('hotel_booking_room_id')
                ->references('id')
                ->on('hotel_booking_rooms')
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
        Schema::dropIfExists('hotel_booking_room_paxes');
    }
};
