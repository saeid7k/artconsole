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
    Schema::create('contacts', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
      $table->foreignId('gallery_id')->constrained()->cascadeOnDelete();
      $table->string('firstname')->nullable();
      $table->string('lastname')->nullable();
      $table->json('address')->nullable();
      $table->string('country_code', 10)->nullable();
      $table->string('phone', 20)->nullable();
      $table->string('website', 100)->nullable();
      $table->string('email', 100)->nullable();
      $table->json('relationship')->nullable();
      $table->json('business')->nullable();
      $table->date('birthday')->nullable();
      $table->timestamps();
      $table->softDeletes();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('contacts');
  }
};
