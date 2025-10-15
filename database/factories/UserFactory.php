<?php

namespace Database\Factories;

use App\Helpers\AddressHelper;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'firstname' => fake()->firstName(),
            'lastname' => fake()->lastName(),
            'username' => fake()->unique()->userName(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => $this->faker->numerify(mt_rand(2,9) . str_repeat('#', 9)),
            'website' => str_replace('www.', '', parse_url($this->faker->url, PHP_URL_HOST)),
            'address' => [
              'unit' => $this->faker->secondaryAddress,
              'street' => $this->faker->streetAddress,
              'city' => $this->faker->city,
              'province' => $this->faker->randomElement(AddressHelper::CANADIAN_PROVINCE_ABBREVIATIONS()),
              'postal_code' => str_replace([' ', '-'], '', $this->faker->postcode),
              'country' => 'Canada',
            ],
            'bio' => $this->faker->paragraphs(mt_rand(1, 3), true),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
