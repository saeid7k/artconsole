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
    Schema::create('invite_links', function (Blueprint $table) {
      $table->id();
      $table->foreignId('gallery_id')->constrained()->cascadeOnDelete();
      $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
      $table->string('email');
      $table->uuid('token')->unique();
      $table->json('settings')->nullable();
      $table->timestamp('expires_at')->nullable();
      $table->timestamp('registered_at')->nullable();
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('invite_links');
  }
};
