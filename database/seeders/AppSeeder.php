<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AppSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    $this->createDefaultTags();
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
    'Oil on Canvas',
    'Acrylic on Canvas',
    'Oil on Linen',
    'Acrylic on Panel',
    'Oil on Board',
    'Mixed Media on Canvas',
    'Watercolor on Paper',
    'Graphite on Paper',
    'Charcoal on Paper',
    'Ink on Paper',
    'Gouache on Paper',
    'Pastel on Paper',
    'Spray Paint on Canvas',
    'Stencil on Canvas',
    'Tempera on Panel',
    'Gold Leaf on Wood',
    'Encaustic on Panel'
  ];

  private const STYLES = [
    'Abstract',
    'Realism',
    'Impressionism',
    'Expressionism',
    'Cubism',
    'Surrealism',
    'Pop Art',
    'Minimalism',
    'Conceptual',
    'Baroque',
    'Renaissance',
    'Romanticism',
    'Fauvism',
    'Dada',
    'Art Nouveau',
    'Art Deco',
    'Contemporary',
    'Street Art',
    'Photorealism',
    'Neo-Expressionism',
  ];

  private const SUBJECTS = [
    'Women',
    'Men',
    'Nature',
    'Abstract',
    'Urban',
    'Animals',
    'StillLife',
    'Historical',
    'Religious',
    'Mythological',
    'Fantasy',
  ];
}
