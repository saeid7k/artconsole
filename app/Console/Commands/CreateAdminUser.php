<?php

namespace App\Console\Commands;

use App\Models\Gallery;
use App\Models\User;
use Faker\Factory;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

#[Signature('app:create-admin-user')]
#[Description('Create an admin user with specified details.')]

class CreateAdminUser extends Command
{
  /**
   * Execute the console command.
   */
  public function handle()
  {
    $this->comment('Creating admin user and the gallery...');

    $faker = Factory::create(config('app.locale'));

    $admin = User::factory()->create([
      'firstname' => 'Admin',
      'lastname' => config('app.name', 'Application'),
      'username' => 'admin',
      'email' => config('app.admin_email', 'admin@example.com'),
      'phone' => env('ADMIN_PHONE', ''),
      'website' => env('WEBSITE_URL', 'example.com'),
      'address' => [
        'unit' => 'Unit 1',
        'street' => '1 Yonge St',
        'city' => 'Toronto',
        'province' => 'ON',
        'postal_code' => 'A1A1A1',
        'country' => 'Canada',
      ],
      'password' => Hash::make(env('ADMIN_DEFAULT_PASSWORD', '12345678')),
    ]);
    $avatarData = file_get_contents(resource_path('images/avatar/admin-avatar.png'));
    $admin->addMediaFromString($avatarData)->usingFileName('user-' . $admin->id . '-photo.png')->toMediaCollection('profile-photo');

    $gallery = Gallery::first();
    $gallery->update([
      'address' => [
        'unit' => $faker->secondaryAddress,
        'street' => $faker->streetAddress,
        'city' => 'Toronto',
        'province' => 'ON',
        'postal_code' => str_replace([' ', '-'], '', $faker->postcode),
        'country' => 'Canada',
      ],
      'about' => 'This is the default gallery for the admin user.',
      'country_code' => '+1',
      'phone' => $faker->numerify('437#######'),
      'website' => $faker->domainName,
      'email' => $faker->unique()->safeEmail,
    ]);

    $this->info('✅' . ' Admin user created: ' . config('app.admin_email', 'admin@example.com') . ' / ' . env('ADMIN_DEFAULT_PASSWORD', '12345678'));
  }
}
