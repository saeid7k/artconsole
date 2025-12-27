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
    $mediums = Tag::factory()->createMany(
      array_map(fn($medium) => [
        'gallery_id' => null,
        'type' => 'medium',
        'value' => $medium,
      ], self::MEDIUMS)
    );

    $styles = Tag::factory()->createMany(
      array_map(fn($style) => [
        'gallery_id' => null,
        'type' => 'style',
        'value' => $style,
      ], self::STYLES)
    );

    $subjects = Tag::factory()->createMany(
      array_map(fn($subject) => [
        'gallery_id' => null,
        'type' => 'subject',
        'value' => $subject,
      ], self::SUBJECTS)
    );
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
