<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\Gallery;
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
        'phone' => '2345678901',
        'website' => env('WEBSITE_URL', 'example.com'),
        'address' => [
          'unit' => 'Unit 1',
          'street' => '123 Yonge St',
          'city' => 'Toronto',
          'province' => 'ON',
          'postal_code' => 'A1A1A1',
          'country' => 'Canada',
        ],
        'password' => Hash::make('12345678'),
      ]);
      $this->command->info('Admin user created: ' . env('ADMIN_EMAIL', 'admin@example.com') . ' / 12345678');

      User::factory(10)->create();
      $this->command->info('10 fake users created.');

      Contact::factory(50)->create([
        'gallery_id' => Gallery::first()->id,
      ]);
      $this->command->info('50 contacts created for first gallery.');

      $galleries = Gallery::all();
      foreach ($galleries as $gallery) {
        Contact::factory(5)->create([
          'gallery_id' => $gallery->id,
        ]);
      }
      $this->command->info('5 contacts created for each gallery.');
    }
}
