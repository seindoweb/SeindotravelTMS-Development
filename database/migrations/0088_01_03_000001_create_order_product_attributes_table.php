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
        Schema::create('order_product_attributes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id');
            $table->string('code')->unique();
            $table->unsignedBigInteger('product_attribute_id')->nullable();
            $table->enum('order_status', ['B', 'P', 'C', 'D', 'F', 'A', 'E'])->nullable()->default('B')->comment('Booking,Progress,Confirmed,Done,Aborted,Failed,Expired');
            $table->string('resource_provider'); // VIA, SEINDO, MG_BEDBANK
            $table->string('ref_id')->nullable()->unique(); // VIA => "refId": "FMNTID3000AA460", MG =>"mgBookingID": "AGID0044371909007168",
            $table->string('ref_url')->nullable()->unique(); // A URL that can direct to a page accessible via the system.
            $table->foreignId('created_by')->nullable()->constrained('users')->cascadeOnUpdate()->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->cascadeOnUpdate()->nullOnDelete();
            $table->timestamps();

            $table
                ->foreign('order_id')
                ->references('id')
                ->on('orders')
                ->constrained()
                ->onUpdate('cascade')
                ->onDelete('cascade');

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
        Schema::dropIfExists('order_product_attributes');
    }
};
