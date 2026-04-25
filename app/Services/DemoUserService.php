<?php

namespace App\Services;

use App\Enums\ArtworkStatus;
use App\Enums\ReportType;
use App\Models\Contact;
use App\Models\Gallery;
use App\Models\Report;
use App\Models\User;
use Faker\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DemoUserService
{
  protected $faker;

  public function __construct(protected ?User $user = null) {
    $this->faker = Factory::create(config('app.locale'));
  }

  public function createDemoUser(int $order = 1): void
  {

    $user = User::create([
      'firstname' => 'John',
      'lastname' => 'Doe',
      'username' => 'demo_' . $order,
      'email' => 'demo_' . $order . '@artconsole.ai',
      'country_code' => '+1',
      'phone' => $this->faker->numerify(mt_rand(2, 9) . str_repeat('#', 9)),
      'website' => 'example.com',
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
      'phone' => '2222222222',
      'website' => 'example.com',
      'email' => 'gallery@example.com',
    ]);

    // create second location
    $gallery->locations()->create([
      'type' => 'external',
      'name' => 'Queen St Store',
      'phone' => $this->faker->numerify(mt_rand(2, 9) . str_repeat('#', 9)),
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
    $mahshidContact = $gallery->contacts()->create([
      'firstname' => 'Mahshid',
      'lastname' => 'K.V.',
      'country_code' => '+1',
      'email' => 'mahshid.khajehvand@gmail.com',
      'relationship' => ['artist'],
      'business' => [
        'name' => 'MoonArt Gallery',
        'title' => 'Art Director',
        'email' => 'info@moonart.ca',
        'website' => 'moonart.ca',
      ]
    ]);

    // add artworks
    $this->addArtworks($gallery);

    // assign Mahshid's artworks to her contact
    $gallery->artworks()
      ->where('artist_data->firstname', 'Mahshid')
      ->where('artist_data->lastname', 'K.V.')
      ->update(['artist_id' => $mahshidContact->id]);

    // create reports
    $this->createReports($gallery);
  }

  private function addArtworks(Gallery $gallery): void
  {
    $data = json_decode(file_get_contents(resource_path('demo/demo_artworks.json')), true);
    shuffle($data);

    $locationIds = $gallery->locations()->pluck('id')->toArray();
    $statuses = array_diff(ArtworkStatus::values(), ['sold']);

    foreach ($data as $artworkData) {
      $artwork = $gallery->artworks()->create($artworkData + [
        'creator_id' => $gallery->owner->id,
        'location_id' => $locationIds[array_rand($locationIds)],
        'ownership' => 'owned',
        'acquisition_date' => now()->subDays(rand(365, 3650)),
        'acquisition_price' => round($artworkData['price'] * rand(50, 90) / 100),
        'status' => $statuses[array_rand($statuses)]
      ]);
      $imagesDirectory = resource_path('demo/demo-artworks-images/' . str_replace([','], '', $artworkData['title']));
      if (is_dir($imagesDirectory)) {
        $imagePaths = glob($imagesDirectory . '/*.{jpg,jpeg,png,webp,avif}', GLOB_BRACE);
        $imagePaths = array_values(array_filter($imagePaths, 'is_file'));
        foreach ($imagePaths as $i => $imagePath) {
          $extension = pathinfo($imagePath, PATHINFO_EXTENSION);
          $artwork->addMedia($imagePath)
            ->preservingOriginal()
            ->usingFileName(Str::slug($artwork->title) . '-' . ($i + 1) . '.' . $extension)
            ->withCustomProperties(['is_main' => $i === 0])
            ->toMediaCollection('artwork-images');
        }
      }
    }
  }

  private function createReports(Gallery $gallery): void
  {
    $artworkIds = $gallery->artworks()->pluck('id')->toArray();

    $inventoryReportsData = [
      1 => [
        'artworks' => $artworkIds,
        'description' => 'Inventory report of all gallery artworks.',
      ],
      2 => [
        'artworks' => $gallery->locations()->first()->artworks()->pluck('id')->toArray(),
        'description' => 'Inventory report of artworks in the primary location.',
      ],
    ];

    foreach ($inventoryReportsData as $i => $reportData) {
      $report = Report::create([
        'gallery_id' => $gallery->id,
        'user_id' => $gallery->owner->id,
        'type' => ReportType::Inventory->value,
        'name' => 'Inventory Report ' . ($i),
        'description' => $reportData['description'],
        'options' => [
          'header' => true,
        ],
        'artworks' => $reportData['artworks'],
        'created_at' => now()->subDays(30 - $i * 3),
      ]);
      (new ReportService($report))->generatePdf();
    }

    $labelReportsData = [
      1 => [
        'description' => 'Medium label report of all artworks with all options enabled',
        'options' => [
          'size' => 'medium',
          'sku' => true,
          'artist_name' => true,
          'artwork_title' => true,
          'mediums' => true,
          'dimensions' => true,
          'price' => true,
          'border' => true,
        ],
      ],
      2 => [
        'description' => 'Small label report of all artworks with all options enabled',
        'options' => [
          'size' => 'small',
          'sku' => true,
          'artist_name' => true,
          'artwork_title' => true,
          'mediums' => true,
          'dimensions' => true,
          'price' => true,
          'border' => true,
        ],
      ]
    ];

    foreach ($labelReportsData as $i => $reportData) {
      $selectedIds = $artworkIds;
      $report = Report::create([
        'gallery_id' => $gallery->id,
        'user_id' => $gallery->owner->id,
        'type' => ReportType::ArtworksLabel->value,
        'name' => 'Label Report ' . ($i),
        'description' => $reportData['description'],
        'options' => $reportData['options'],
        'artworks' => $selectedIds,
        'created_at' => now()->subDays(20 - $i * 5),
      ]);
      (new ReportService($report))->generatePdf();
    }
  }
}
