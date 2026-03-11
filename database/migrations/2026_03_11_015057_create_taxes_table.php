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
    Schema::create('taxes', function (Blueprint $table) {
      $table->id();
      $table->foreignId('gallery_id')->constrained()->onDelete('cascade');
      $table->string('name', 255);
      $table->string('abbreviation', 50)->nullable();
      $table->decimal('rate', 5, 2);
      $table->text('description')->nullable();
      $table->string('tax_number', 100)->nullable();
      $table->boolean('default')->default(false);
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('taxes');
  }
};
