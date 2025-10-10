<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\User;
use Illuminate\Database\Seeder;

class ContactSeeder extends Seeder
{
  public function run(): void
  {
    Contact::factory(50)->create([
      'user_id' => User::first()->id,
    ]);
  }
}
