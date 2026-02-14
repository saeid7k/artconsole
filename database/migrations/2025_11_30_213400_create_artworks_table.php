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
      $table->string('title', 255);
      $table->string('year', 100)->nullable(); // 2023, Circa 19th Century
      $table->decimal('price', 10, 2)->nullable();
      $table->json('edition')->nullable(); // {type: [unique|limited|open], number: 1, size: 50}
      $table->boolean('signed')->default(false);
      $table->text('signature_note')->nullable();
      $table->text('description')->nullable();

      $table->string('category', 100);
      $table->json('subjects')->nullable();
      $table->json('mediums')->nullable();
      $table->json('styles')->nullable();
      $table->json('dimensions')->nullable();

      $table->string('ownership', 50)->nullable(); // owned | consigned
      $table->foreignId('owner_contact_id')->nullable()->constrained('contacts')->nullOnDelete();
      $table->text('consignment_terms')->nullable(); // Note about consignment agreement
      $table->text('provenance')->nullable(); // Note about history of ownership

      $table->json('details')->nullable(); // Additional metadata
      $table->string('status', 50)->default('available');

      $table->timestamps();
      $table->softDeletes();
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
