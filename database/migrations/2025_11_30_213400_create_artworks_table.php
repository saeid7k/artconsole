<?php

use App\Models\Contact;
use App\Models\User;
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
    Schema::create('artworks', function (Blueprint $table) {
      $table->id();
      $table->foreignIdFor(User::class, 'creator_id')->nullOnDelete();
      $table->foreignId('gallery_id')->constrained()->cascadeOnDelete();
      $table->foreignId('location_id')->nullOnDelete();
      $table->foreignIdFor(Contact::class, 'artist_id')->nullable()->nullOnDelete();
      $table->json('artist_data')->nullable(); // Store artist data when is not linked to a Contact

      $table->string('sku', 100)->nullable(); // PNT-25-001
      $table->string('category', 100);
      $table->json('edition', 100)->nullable(); // {type: [unique|limited|open], number: 1, size: 50}

      $table->string('title', 255);
      $table->string('subject', 100)->nullable();
      $table->text('description')->nullable();
      $table->string('year', 100)->nullable(); // 2023, Circa 19th Century
      $table->json('dimensions')->nullable();
      $table->decimal('price', 10, 2)->nullable();

      $table->string('medium', 100)->nullable(); // Oil on Canvas
      $table->json('styles')->nullable(); // Abstract, Realism
      $table->json('collections')->nullable(); // Modern Art, Renaissance

      $table->string('ownership', 50)->nullable(); // owned | consigned
      $table->foreignId('owner_contact_id')->nullable()->constrained('contacts')->nullOnDelete();
      $table->string('status', 50)->default('available');

      $table->json('details')->nullable(); // Additional metadata
      $table->text('notes')->nullable();

      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('artworks');
  }
};
