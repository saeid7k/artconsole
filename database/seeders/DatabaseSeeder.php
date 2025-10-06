<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
      User::factory()->create([
        'firstname' => 'Admin',
        'lastname' => env('APP_NAME', 'App'),
        'username' => 'admin',
        'email' => env('ADMIN_EMAIL', 'admin@example.com'),
        'password' => Hash::make('12345678'),
      ]);

      User::factory(10)->create();
    }
}
