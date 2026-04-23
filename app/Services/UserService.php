<?php

namespace App\Services;

use App\Models\Contact;
use App\Models\User;
use Faker\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserService
{
  public function __construct(protected ?User $user = null) {}

  public function createDemoUser(int $order = 1): void
  {
    $faker = Factory::create(config('app.locale'));

    $user = User::create([
      'firstname' => 'John',
      'lastname' => 'Doe',
      'username' => 'demo_' . $order,
      'email' => 'demo_' . $order . '@artconsole.ai',
      'country_code' => '+1',
      'phone' => $faker->numerify(mt_rand(2, 9) . str_repeat('#', 9)),
      'website' => str_replace('www.', '', parse_url($faker->url, PHP_URL_HOST)),
      'address' => [
        'unit' => null,
        'street' => '1 King St W',
        'city' => 'Toronto',
        'province' => 'ON',
        'postal_code' => 'M5H1A1',
        'country' => 'Canada',
      ],
      'email_verified_at' => now(),
      'password' => Hash::make(Str::random(8)),
      'is_demo' => true,
    ]);

    $user->setRandomAvatar();

    // update gallery
    $gallery = $user->galleriesOwned()->first();
    $gallery->update([
      'about' => 'Welcome to my art gallery! I am passionate about collecting and showcasing unique artworks from emerging and established artists. This is a demo gallery created to explore the features of ArtConsole.',
      'address' => [
        'unit' => null,
        'street' => '1 Adelaide St W',
        'city' => 'Toronto',
        'province' => 'ON',
        'postal_code' => 'M5H1L6',
        'country' => 'Canada',
      ],
      'country_code' => '+1',
      'phone' => $faker->numerify(mt_rand(2, 9) . str_repeat('#', 9)),
      'website' => str_replace('www.', '', parse_url($faker->url, PHP_URL_HOST)),
      'email' => 'gallery@example.com',
    ]);

    // create second location
    $gallery->locations()->create([
      'type' => 'external',
      'name' => 'Queen St Store',
      'phone' => $faker->numerify(mt_rand(2, 9) . str_repeat('#', 9)),
      'email' => 'store@example.com',
      'address' => [
        'unit' => null,
        'street' => '1 Queen St W',
        'city' => 'Toronto',
        'province' => 'ON',
        'postal_code' => 'M5H3W4',
        'country' => 'Canada',
      ],
      'address_same_as_gallery' => false,
      'is_primary' => false,
      'is_active' => true,
    ]);

    // create contacts
    Contact::factory(50)->create([
      'user_id' => $user->id,
      'gallery_id' => $gallery->id,
    ]);
  }
}
