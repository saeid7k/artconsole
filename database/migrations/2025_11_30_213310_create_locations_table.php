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
    Schema::create('locations', function (Blueprint $table) {
      $table->id();
      $table->foreignId('gallery_id')->constrained()->cascadeOnDelete();
      $table->string('type', 100);
      $table->foreignId('contact_id')->nullable()->nullOnDelete();
      $table->string('name');
      $table->text('description')->nullable();
      $table->string('phone')->nullable();
      $table->string('email')->nullable();
      $table->json('address')->nullable();
      $table->boolean('address_same_as_gallery')->default(true);
      $table->boolean('is_primary')->default(false);
      $table->boolean('is_active')->default(true);
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('locations');
  }
};
