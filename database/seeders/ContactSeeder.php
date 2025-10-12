<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\Gallery;
use Illuminate\Database\Seeder;

class ContactSeeder extends Seeder
{
  public function run(): void
  {
    Contact::factory(50)->create([
      'gallery_id' => Gallery::first()->id,
    ]);
  }
}
