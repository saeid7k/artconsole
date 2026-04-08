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
      $table->json('artist_data')->nullable();

      $table->string('sku', 100)->nullable();
      $table->string('title', 255);
      $table->string('year', 100)->nullable();
      $table->decimal('price', 10, 2)->nullable();
      $table->json('edition')->nullable();
      $table->boolean('signed')->default(false);
      $table->text('signature_note')->nullable();
      $table->text('description')->nullable();

      $table->string('category', 100);
      $table->json('subjects')->nullable();
      $table->json('mediums')->nullable();
      $table->json('styles')->nullable();
      $table->json('dimensions')->nullable();

      $table->string('ownership', 50)->nullable();
      $table->date('acquisition_date')->nullable();
      $table->decimal('acquisition_price', 10, 2)->nullable();
      $table->foreignId('owner_contact_id')->nullable()->constrained('contacts')->nullOnDelete();
      $table->string('commission_mode', 50)->default('percentage');
      $table->decimal('commission_value', 10, 2)->default(0);
      $table->text('consignment_terms')->nullable();
      $table->text('provenance')->nullable();

      $table->json('details')->nullable();
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
