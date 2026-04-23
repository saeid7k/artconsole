<?php

namespace App\Services;

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
  }
}
