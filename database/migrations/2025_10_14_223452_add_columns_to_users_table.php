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
      $table->integer('token_balance')->default(0)->after('bio');
      $table->boolean('is_demo')->default(false)->after('token_balance');
      $table->timestamp('demo_claimed_at')->nullable()->after('is_demo');
      // Cashier / Stripe columns for token top-up billing
      $table->string('stripe_id')->nullable()->index()->after('demo_claimed_at');
      $table->string('pm_type')->nullable()->after('stripe_id');
      $table->string('pm_last_four', 4)->nullable()->after('pm_type');
      $table->timestamp('trial_ends_at')->nullable()->after('pm_last_four');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::table('users', function (Blueprint $table) {
      $table->dropIndex('users_stripe_id_index');
      $table->dropColumn(['country_code', 'phone', 'website', 'address', 'bio', 'token_balance', 'is_demo', 'demo_claimed_at', 'stripe_id', 'pm_type', 'pm_last_four', 'trial_ends_at']);
    });
  }
};
