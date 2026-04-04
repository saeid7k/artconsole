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
    Schema::table('users', function (Blueprint $table) {
      $table->string('country_code', 10)->nullable()->after('email');
      $table->string('phone')->nullable()->after('country_code');
      $table->string('website')->nullable()->after('phone');
      $table->json('address')->nullable()->after('website');
      $table->text('bio')->nullable()->after('address');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::table('users', function (Blueprint $table) {
      $table->dropColumn(['country_code', 'phone', 'website', 'address', 'bio']);
    });
  }
};
