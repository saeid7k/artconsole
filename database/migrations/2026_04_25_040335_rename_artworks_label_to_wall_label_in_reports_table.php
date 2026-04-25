<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('reports')
            ->where('type', 'artworks_label')
            ->update(['type' => 'wall_label']);
    }

    public function down(): void
    {
        DB::table('reports')
            ->where('type', 'wall_label')
            ->update(['type' => 'artworks_label']);
    }
};
