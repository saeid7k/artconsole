<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('gallery_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('gallery_id')->constrained()->onDelete('cascade');
            $table->string('access')->default('viewer');
            $table->timestamps();
            $table->unique(['user_id', 'gallery_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gallery_user');
    }
};
