<?php

namespace Database\Seeders;

use App\Models\Tag;
use App\Services\DemoUserService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;

class AppSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    $this->createDefaultTags();

    $this->command->comment('Creating admin user...');
    Artisan::call('app:create-admin-user');
    $this->command->info('✅ Admin user created.');

    $this->command->comment('Creating demo users...');
    for ($i = 1; $i <= 3; $i++) {
      (new DemoUserService())->createDemoUser($i);
    }
    $this->command->info('✅ Demo users created.');
  }

  private function createDefaultTags()
  {
    $this->command->comment('Creating default tags...');

    foreach (self::MEDIUMS as $medium) {
      Tag::create([
        'gallery_id' => null,
        'type' => 'medium',
        'value' => $medium,
      ]);
    }

    foreach (self::STYLES as $style) {
      Tag::create([
        'gallery_id' => null,
        'type' => 'style',
        'value' => $style,
      ]);
    }

    foreach (self::SUBJECTS as $subject) {
      Tag::create([
        'gallery_id' => null,
        'type' => 'subject',
        'value' => $subject,
      ]);
    }

    $this->command->info('✅' . ' Default tags created.');
  }

  private const MEDIUMS = [
    'Acrylic on Canvas',
    'Acrylic on Panel',
    'Charcoal on Paper',
    'Encaustic on Panel',
    'Gold Leaf on Wood',
    'Gouache on Paper',
    'Graphite on Paper',
    'Ink on Paper',
    'Mixed Media on Canvas',
    'Oil on Board',
    'Oil on Canvas',
    'Oil on Linen',
    'Pastel on Paper',
    'Spray Paint on Canvas',
    'Stencil on Canvas',
    'Tempera on Panel',
    'Watercolor on Paper',
  ];

  private const STYLES = [
    'Abstract',
    'Art Deco',
    'Art Nouveau',
    'Baroque',
    'Conceptual',
    'Contemporary',
    'Contemporary Impressionism',
    'Cubism',
    'Dada',
    'Expressionism',
    'Fauvism',
    'Figurative',
    'Impressionism',
    'Minimalism',
    'Neo-Expressionism',
    'Photorealism',
    'Pop Art',
    'Realism',
    'Renaissance',
    'Romanticism',
    'Street Art',
    'Surrealism',
    'Symbolism'
  ];

  private const SUBJECTS = [
    'Abstract',
    'Animals',
    'Architecture',
    'Cities',
    'Cityscape',
    'Couple',
    'Dreams',
    'Fantasy',
    'Figure',
    'Historical',
    'Human Connection',
    'Landscape',
    'Love',
    'Men',
    'Music',
    'Mythological',
    'Nature',
    'Performing Arts',
    'Portrait',
    'Psychological',
    'Religious',
    'Romance',
    'Still Life',
    'Time',
    'Urban',
    'Women',
  ];
}
