<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('name');
            $table->string('firstname')->nullable()->after('id');
            $table->string('lastname')->nullable()->after('firstname');
            $table->string('username')->nullable()->unique()->after('lastname');
            $table->json('social_auth_id')->nullable()->after('email_verified_at');
            $table->string('password')->nullable()->change();
            $table->timestamp('deleted_at')->nullable()->after('updated_at');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['firstname', 'lastname', 'username']);
            $table->string('name')->after('id');
        });
    }
};
