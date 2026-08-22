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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->string('full_name');

            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');

            $table->string('dial_code')->nullable();
            $table->string('phone_number')->nullable();

            $table->string('identity_type')->nullable()->unique();
            $table->string('identity_number')->nullable();

            $table->string('gender')->nullable();
            $table->string('place_of_birth')->nullable();
            $table->date('date_of_birth')->nullable();

            $table->string('referral_code')->nullable()->unique();
            $table->boolean('has_credit')->default(false);
            $table->boolean('is_agent')->default(false);
            $table->unsignedBigInteger('upline_id')->nullable();

            $table->unsignedMediumInteger('country_id')->nullable();
            $table->unsignedMediumInteger('state_id')->nullable();
            $table->unsignedMediumInteger('city_id')->nullable();
            $table->text('address')->nullable();
            $table->string('zip_code')->nullable();

            $table->string('locale')->nullable()->default('id');
            $table->string('currency')->nullable()->default('IDR');
            $table->text('profile_photo_path')->nullable();
            $table->boolean('active')->default(true);
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
            $table->foreignId('created_by')->nullable()->constrained('users')->cascadeOnUpdate()->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->cascadeOnUpdate()->nullOnDelete();

            $table->foreign('upline_id')->references('id')->on('users')->cascadeOnUpdate()->nullOnDelete();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
