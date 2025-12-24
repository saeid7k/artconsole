<?php

namespace Database\Factories;

use App\Enums\ArtworkCategory;
use App\Enums\ArtworkEdition;
use App\Enums\ArtworkStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Artwork>
 */
class ArtworkFactory extends Factory
{
  /**
   * Define the model's default state.
   *
   * @return array<string, mixed>
   */
  public function definition(): array
  {
    $category = $this->faker->randomElement(ArtworkCategory::cases())->value;
    $editionType = $this->faker->randomElement(ArtworkEdition::cases())->value;

    return [
      'artist_data' => [
        'firstname' => $this->faker->firstName,
        'lastname' => $this->faker->lastName,
        'bio' => $this->faker->optional(0.5, null)->paragraph,
      ],
      'category' => $category,
      'edition' => [
        'type' => $editionType,
        'number' => $editionType === 'unique' ? 1 : ($editionType === 'limited' ? $this->faker->numberBetween(1, 10) : $this->faker->numberBetween(1, 100)),
        'size' => $editionType === 'unique' ? 1 : ($editionType === 'limited' ? $this->faker->randomElement([10, 100, 500]) : null),
      ],
      'title' => $this->faker->randomElement(self::TITLES),
      'subject' => $this->faker->randomElement(self::SUBJECTS),
      'description' => $this->faker->paragraph,
      'year' => (string) $this->faker->year,
      'dimensions' => [
        'width' => $this->faker->randomElement([12, 16, 20, 24, 30, 36, 48]),
        'height' => $this->faker->randomElement([12, 16, 20, 24, 30, 36, 48]),
        'depth' => $this->faker->randomElement([0.75, 1.5, 2]),
        'unit' => $this->faker->randomElement(['inches', 'cm']),
      ],
      'price' => $this->faker->numberBetween(1, 100) * 100,
      'medium' => $this->faker->randomElement(self::MEDIUMS),
      'styles' => $this->faker->randomElements(self::STYLES, $this->faker->numberBetween(1, 3), false),
      'collections' => null,
      'ownership' => $this->faker->randomElement(['owned', 'consigned']),
      'status' => $this->faker->randomElement(ArtworkStatus::cases())->value,
      'details' => null,
      'notes' => $this->faker->optional(0.3)->paragraph,
    ];
  }

  private const TITLES = [
    'Untitled',
    'Composition VIII',
    'Sunset Boulevard',
    'The Red Studio',
    'Blue Morning',
    'Urban Rhythm',
    'Silence in Motion',
    'Portrait of a Stranger',
    'Golden Hour',
    'Neon Dreams',
    'Reflections on Water',
    'The Lost City',
    'Geometric Harmony',
    'Midnight in Paris',
    'Fragments of Time',
    'The White Room',
    'Eternal Spring',
    'Shadows and Light',
    'The Awakening',
    'Ocean Breeze',
    'Desert Mirage',
    'Study in Scarlet',
    'The Dreamer',
    'Chaos Theory',
    'Morning Mist',
    'The Garden of Earthly Delights',
    'Solitude',
    'Industrial Landscape',
    'Floral Symphony',
    'The Observer',
    'Night Watch',
    'Abstract Reality',
    'The Crossing',
    'Whispers in the Dark',
    'Summer Haze',
    'Winter Solstice',
    'The Alchemist',
    'Chromatic Fugue',
    'The Last Supper',
    'Parallel Universes',
    'The Great Wave',
    'Silent Echo',
    'Metropolis',
    'The Kiss',
    'Starry Night',
    'Fields of Gold',
    'The Wanderer',
    'Beyond the Horizon',
    'Inner Sanctum',
    'Digital Frontier',
    'The Void',
    'Celestial Dance',
    'Crimson Tide',
    'The Architect',
    'Fading Memories',
    'The Sentinel',
    'Aurora Borealis',
    'The masquerade',
    'Serenity Now',
    'Stormy Seas',
    'The Old Guitarist',
    'Girl with a Pearl Earring',
    'The Persistence of Memory',
    'Guernica',
    'The Birth of Venus',
    'American Gothic',
    'The Scream',
    'Water Lilies',
    'The Night Café',
    'Les Demoiselles d\'Avignon',
    'Nighthawks',
    'Las Meninas',
    'The Arnolfini Portrait',
    'The Hay Wain',
    'The Fighting Temeraire',
    'Rain, Steam and Speed',
    'The Swing',
    'Liberty Leading the People',
    'Wanderer above the Sea of Fog',
    'The Raft of the Medusa',
    'The Third of May 1808',
    'Saturn Devouring His Son',
    'The Garden of Love',
    'The Three Graces',
    'The School of Athens',
    'Primavera',
    'The Birth of Adam',
    'The Last Judgment',
    'The Tower of Babel',
    'Hunters in the Snow',
    'The Peasant Wedding',
    'Wheat Field with Cypresses',
    'Bedroom in Arles',
    'Self-Portrait with Bandaged Ear',
    'The Potato Eaters',
    'Café Terrace at Night',
    'Irises',
    'Almond Blossoms',
    'The Starry Night over the Rhône'
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
}
