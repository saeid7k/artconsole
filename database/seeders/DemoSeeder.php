<?php

namespace Database\Seeders;

use App\Models\Artwork;
use App\Models\Contact;
use App\Models\Gallery;
use App\Models\User;
use Faker\Factory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;

class DemoSeeder extends Seeder
{
  protected ?Gallery $firstGallery = null;
  protected ?Collection $allGalleries = null;
  protected ?Collection $allLocations = null;
  protected $faker;

  public function run(): void
  {
    $this->faker = Factory::create('en_CA');
    $this->createAdmin();
    $this->createFakeUsers();
    $this->addMembers();
    $this->createContacts();
    $this->createArtworks();
  }

  private function createAdmin(): void
  {
    $this->command->comment('Creating admin user and the gallery...');

    $admin = User::factory()->create([
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
    $photoData = Http::get('https://i.pravatar.cc/500')->body() ?? null;
    if ($photoData) {
      $admin->addMediaFromString($photoData)->usingFileName('user-' . $admin->id . '-photo.jpg')->toMediaCollection('profile-photo');
    }

    $this->command->info('✅' . ' Admin user created: ' . env('ADMIN_EMAIL', 'admin@example.com') . ' / 12345678');

    $this->firstGallery = Gallery::first();
    $this->firstGallery->address = [
      'unit' => $this->faker->secondaryAddress,
      'street' => $this->faker->streetAddress,
      'city' => 'Toronto',
      'province' => 'ON',
      'postal_code' => str_replace([' ', '-'], '', $this->faker->postcode),
      'country' => 'Canada',
    ];
    $this->firstGallery->save();

    $this->command->info('✅' . ' First gallery address has been set.');
  }

  private function createFakeUsers(): void
  {
    $this->command->comment('Creating 10 fake users...');
    User::factory(10)->create();
    $user = User::all();
    foreach ($user as $u) {
      if (!$u->is_admin()) {
        $photoData = Http::get('https://i.pravatar.cc/500')->body() ?? null;
        if ($photoData) {
          $u->addMediaFromString($photoData)->usingFileName('user-' . $u->id . '-photo.jpg')->toMediaCollection('profile-photo');
        }
      }
    }
    $this->command->info('✅' . ' 10 fake users created.');
    $this->allGalleries = Gallery::all();
    foreach ($this->allGalleries as $gallery) {
      if ($gallery->user_id !== 1) {
        $gallery->address = [
          'unit' => $this->faker->secondaryAddress,
          'street' => $this->faker->streetAddress,
          'city' => 'Toronto',
          'province' => 'ON',
          'postal_code' => str_replace([' ', '-'], '', $this->faker->postcode),
          'country' => 'Canada',
        ];
        $gallery->website = $this->faker->domainName;
        $gallery->email = $this->faker->unique()->safeEmail;
        $gallery->save();
      }
      $logoData = Http::get("https://api.dicebear.com/9.x/shapes/svg?seed={$gallery->id}")->body() ?? null;
      if ($logoData) {
        $gallery->addMediaFromString($logoData)->usingFileName('gallery-' . $gallery->id . '-logo.svg')->toMediaCollection('gallery-logo');
      }
    }
    $this->command->info('✅' . ' all galleries details set.');
  }

  private function addMembers(): void
  {
    $this->command->comment('Adding 3 members to the first gallery...');
    $users = User::all();
    $this->firstGallery->addMember($users[1], 'editor');
    $this->firstGallery->addMember($users[2], 'viewer');
    $this->firstGallery->addMember($users[3], 'viewer');
    $this->command->info('✅' . ' 3 members added to first gallery.');
  }

  private function createContacts(): void
  {
    $this->command->comment('Creating contacts...');
    Contact::factory(50)->create([
      'gallery_id' => $this->firstGallery->id,
    ]);
    $this->command->info('✅' . ' 50 contacts created for first gallery.');

    foreach ($this->allGalleries as $gallery) {
      Contact::factory(5)->create([
        'gallery_id' => $gallery->id,
      ]);
    }
    $this->command->info('✅' . ' 5 contacts created for each gallery.');
  }

  private function createArtworks(): void
  {
    $this->command->comment('Creating artworks for all galleries...');
    $this->allLocations = $this->allGalleries->flatMap(function (Gallery $gallery) {
      return $gallery->locations;
    });
    $artworks = $this->allLocations->flatMap(function ($location) {
      $gallery = $location->gallery;
      $owner = $gallery->owner;
      $artistIds = $gallery->artists()->inRandomOrder()->pluck('id')->toArray();
      return Artwork::factory(10)->create([
        'creator_id' => $owner->id,
        'gallery_id' => $location->gallery_id,
        'location_id' => $location->id,
        'artist_id' => $this->faker->randomElement($artistIds) ?? null,
      ]);
    });
    $this->command->info('✅' . ' 10 Artworks created per location.');
  }
}
