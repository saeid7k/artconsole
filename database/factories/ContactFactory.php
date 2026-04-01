<?php

namespace Database\Factories;

use App\Helpers\AddressHelper;
use App\Models\Contact;
use Illuminate\Database\Eloquent\Factories\Factory;

class ContactFactory extends Factory
{
  protected $model = Contact::class;

  public function definition(): array
  {
    return [
      'firstname' => $this->faker->firstName,
      'lastname' => $this->faker->lastName,
      'email' => $this->faker->unique()->safeEmail,
      'country_code' => '+1',
      'phone' => $this->faker->numerify(mt_rand(2,9) . str_repeat('#', 9)),
      'address' => [
        'unit' => $this->faker->secondaryAddress,
        'street' => $this->faker->streetAddress,
        'city' => $this->faker->city,
        'province' => $this->faker->randomElement(AddressHelper::CANADIAN_PROVINCE_ABBREVIATIONS()),
        'postal_code' => str_replace([' ', '-'], '', $this->faker->postcode),
        'country' => 'Canada',
      ],
      'website' => str_replace('www.', '', parse_url($this->faker->url, PHP_URL_HOST)),
      'relationship' => [$this->faker->randomElement(['artist', 'vendor', 'collector', 'other'])],
      'business' => [
        'name' => $this->faker->company,
        'title' => $this->faker->jobTitle,
        'address' => [
          'unit' => $this->faker->secondaryAddress,
          'street' => $this->faker->streetAddress,
          'city' => $this->faker->city,
          'province' => $this->faker->randomElement(AddressHelper::CANADIAN_PROVINCE_ABBREVIATIONS()),
          'postal_code' => str_replace([' ', '-'], '', $this->faker->postcode),
          'country' => 'Canada',
        ],
        'country_code' => '+1',
        'phone' => $this->faker->numerify(mt_rand(2,9) . str_repeat('#', 9)),
        'email' => $this->faker->companyEmail,
        'website' => str_replace('www.', '', parse_url($this->faker->url, PHP_URL_HOST)),
      ],
      'birthday' => $this->faker->dateTimeBetween('-80 years', '-18 years'),
    ];
  }
}
