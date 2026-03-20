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
    Schema::create('invoices', function (Blueprint $table) {
      $table->id();
      $table->foreignId('gallery_id')->constrained()->cascadeOnDelete();
      $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
      $table->foreignId('contact_id')->nullable()->constrained()->nullOnDelete();

      $table->string('number', 100);

      $table->date('date');
      $table->date('due_date')->nullable();

      $table->json('shipping')->nullable();

      $table->foreignId('tax_id')->nullable()->constrained()->nullOnDelete();
      $table->decimal('tax_rate', 5, 2)->nullable();

      $table->decimal('subtotal', 12, 2)->default(0);
      $table->json('available_extra_costs')->nullable();
      $table->decimal('shipping_cost', 12, 2)->default(0);
      $table->boolean('shipping_taxable')->default(true);
      $table->string('discount_type', 50)->nullable();
      $table->decimal('discount_rate', 12, 2)->nullable();
      $table->decimal('discount_amount', 12, 2)->default(0);
      $table->decimal('tax_amount', 12, 2)->default(0);
      $table->decimal('total', 12, 2)->default(0);

      $table->string('status', 50);
      $table->text('notes')->nullable();

      $table->timestamps();
      $table->softDeletes();

      $table->unique(['gallery_id', 'number']);
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('invoices');
  }
};
