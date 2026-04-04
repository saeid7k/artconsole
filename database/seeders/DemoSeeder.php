<?php

namespace Database\Seeders;

use App\Enums\PaymentMethod;
use App\Enums\ReportType;
use App\Models\Artwork;
use App\Models\Contact;
use App\Models\Gallery;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Report;
use App\Models\Tax;
use App\Models\User;
use App\Services\ReportService;
use Faker\Factory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;

class DemoSeeder extends Seeder
{
  protected ?Gallery $firstGallery = null;
  protected ?Collection $allGalleries = null;
  protected ?Collection $allLocations = null;
  protected $faker;

  public function run(): void
  {
    $this->faker = Factory::create('en_CA');
    $this->createAdmin();
    $this->createFakeUsers();
    $this->addMembers();
    $this->createContacts();
    $this->createArtworks();
    $this->createReports();
    $this->createTaxes();
    $this->createInvoices();
  }

  private function createAdmin(): void
  {
    $this->command->comment('Creating admin user and the gallery...');

    $admin = User::factory()->create([
      'firstname' => 'Admin',
      'lastname' => env('APP_NAME', 'App'),
      'username' => 'admin',
      'email' => env('ADMIN_EMAIL', 'admin@example.com'),
      'phone' => '2345678901',
      'website' => env('WEBSITE_URL', 'example.com'),
      'address' => [
        'unit' => 'Unit 1',
        'street' => '123 Yonge St',
        'city' => 'Toronto',
        'province' => 'ON',
        'postal_code' => 'A1A1A1',
        'country' => 'Canada',
      ],
      'password' => Hash::make('12345678'),
    ]);
    $photoData = Http::get('https://i.pravatar.cc/500')->body() ?? null;
    if ($photoData) {
      $admin->addMediaFromString($photoData)->usingFileName('user-' . $admin->id . '-photo.jpg')->toMediaCollection('profile-photo');
    }

    $this->firstGallery = Gallery::first();
    $this->firstGallery->update([
      'address' => [
        'unit' => $this->faker->secondaryAddress,
        'street' => $this->faker->streetAddress,
        'city' => 'Toronto',
        'province' => 'ON',
        'postal_code' => str_replace([' ', '-'], '', $this->faker->postcode),
        'country' => 'Canada',
      ],
      'about' => $this->faker->paragraph,
      'country_code' => '+1',
      'phone' => $this->faker->numerify('437#######'),
      'website' => $this->faker->domainName,
      'email' => $this->faker->unique()->safeEmail,
    ]);

    $this->command->info('✅' . ' Admin user created: ' . env('ADMIN_EMAIL', 'admin@example.com') . ' / 12345678');
  }

  private function createFakeUsers(): void
  {
    $this->command->comment('Creating fake users...');
    User::factory(10)->create();
    $user = User::all();
    foreach ($user as $u) {
      if (!$u->is_admin()) {
        $photoData = Http::get('https://i.pravatar.cc/500')->body() ?? null;
        if ($photoData) {
          $u->addMediaFromString($photoData)->usingFileName('user-' . $u->id . '-photo.jpg')->toMediaCollection('profile-photo');
        }
      }
    }
    $this->command->info('✅' . ' 10 fake users created.');
    $this->allGalleries = Gallery::all();
    foreach ($this->allGalleries as $gallery) {
      if ($gallery->user_id !== 1) {
        $gallery->address = [
          'unit' => $this->faker->secondaryAddress,
          'street' => $this->faker->streetAddress,
          'city' => 'Toronto',
          'province' => 'ON',
          'postal_code' => str_replace([' ', '-'], '', $this->faker->postcode),
          'country' => 'Canada',
        ];
        $gallery->website = $this->faker->domainName;
        $gallery->email = $this->faker->unique()->safeEmail;
        $gallery->save();
      }
      $logoData = Http::get("https://api.dicebear.com/9.x/shapes/svg?seed={$gallery->id}")->body() ?? null;
      if ($logoData) {
        $gallery->addMediaFromString($logoData)->usingFileName('gallery-' . $gallery->id . '-logo.svg')->toMediaCollection('gallery-logo');
      }
    }
    $this->command->info('✅' . ' all galleries details set.');
  }

  private function addMembers(): void
  {
    $this->command->comment('Adding members...');
    $users = User::all();
    $this->firstGallery->addMember($users[1], 'editor');
    $this->firstGallery->addMember($users[2], 'viewer');
    $this->firstGallery->addMember($users[3], 'viewer');
    $this->command->info('✅' . ' 3 members added to first gallery.');
  }

  private function createContacts(): void
  {
    $this->command->comment('Creating contacts...');
    Contact::factory(50)->create([
      'gallery_id' => $this->firstGallery->id,
    ]);
    $this->command->info('✅' . ' 50 contacts created for first gallery.');

    foreach ($this->allGalleries as $gallery) {
      Contact::factory(5)->create([
        'gallery_id' => $gallery->id,
      ]);
    }
    $this->command->info('✅' . ' 5 contacts created for each gallery.');
  }

  private function createArtworks(): void
  {
    $this->command->comment('Creating artworks...');
    $this->allLocations = $this->allGalleries->flatMap(function (Gallery $gallery) {
      return $gallery->locations;
    });
    $artworks = $this->allLocations->flatMap(function ($location) {
      $gallery = $location->gallery;
      $owner = $gallery->owner;
      return Artwork::factory(25)->create([
        'creator_id' => $owner->id,
        'gallery_id' => $location->gallery_id,
        'location_id' => $location->id,
      ]);
    });
    $this->command->info('✅' . ' 25 Artworks created per location.');

    // Add artist and images to artworks
    $this->command->comment('Assigning artists and adding images to artworks...');
    foreach ($artworks as &$artwork) {
      // Assign an artist
      $gallery = $artwork->gallery;
      $artistIds = $gallery->artists()->inRandomOrder()->pluck('id')->toArray();
      $vendorsIds = $gallery->contacts()->whereJsonContains('relationship', 'vendor')->inRandomOrder()->pluck('id')->toArray();
      if (!empty($artistIds)) {
        $artwork->artist_id = $this->faker->randomElement($artistIds);
        if ($artwork->ownership === 'consigned' && !empty($vendorsIds)) {
          $artwork->owner_contact_id = $this->faker->randomElement($vendorsIds);
        }
        $artwork->saveQuietly();
      }

      if ($gallery->id == 1) {
        // Add images to artworks in the first gallery
        $numImages = rand(1, 3);
        for ($i = 0; $i < $numImages; $i++) {
          $size = $this->faker->randomElement(['800/800', '800/600', '600/800', '800/700', '700/800', '400/800']);
          $imageData = Http::get('https://picsum.photos/' . $size)->body() ?? null;
          if ($imageData) {
            $artwork->addMediaFromString($imageData)
              ->usingFileName('artwork-' . $artwork->id . '-image-' . ($i + 1) . '.jpg')
              ->withCustomProperties(['is_main' => $i === 0])
              ->toMediaCollection('artwork-images');
          }
        }
      }
    }
    $this->command->info('✅' . ' Sample images added to artworks of the first gallery.');
  }

  private function createReports(): void
  {
    $this->command->comment('Creating reports...');

    $sizes = ['small', 'medium', 'large'];
    $artworkIds = Artwork::where('gallery_id', $this->firstGallery->id)->pluck('id')->toArray();

    for ($i = 0; $i < 5; $i++) {
      $selectedIds = $this->faker->randomElements($artworkIds, min($this->faker->numberBetween(3, 30), count($artworkIds)));
      $report = Report::create([
        'gallery_id' => $this->firstGallery->id,
        'user_id' => 1,
        'type' => ReportType::ArtworksLabel->value,
        'name' => 'Artworks Label Report ' . ($i + 1),
        'description' => $this->faker->paragraph,
        'options' => [
          'size' => $this->faker->randomElement($sizes),
          'sku' => $this->faker->boolean,
          'artist_name' => true,
          'artwork_title' => true,
          'mediums' => true,
          'dimensions' => true,
          'price' => true,
          'border' => $this->faker->boolean,
        ],
        'artworks' => $selectedIds,
        'created_at' => now()->subDays(5 - $i),
      ]);
      (new ReportService($report))->generatePdf();
    }

    // Inventory report 1: between label report 1 (subDays(5)) and label report 2 (subDays(4))
    $selectedIds = $this->faker->randomElements($artworkIds, min($this->faker->numberBetween(5, 30), count($artworkIds)));
    $report = Report::create([
      'gallery_id' => $this->firstGallery->id,
      'user_id' => 1,
      'type' => ReportType::Inventory->value,
      'name' => 'Inventory Report 1',
      'description' => $this->faker->paragraph,
      'options' => [
        'header' => $this->faker->boolean,
      ],
      'artworks' => $selectedIds,
      'created_at' => now()->subDays(4)->subHours(12),
    ]);
    (new ReportService($report))->generatePdf();

    // Inventory report 2: between label report 3 (subDays(3)) and label report 4 (subDays(2))
    $selectedIds = $this->faker->randomElements($artworkIds, min($this->faker->numberBetween(5, 30), count($artworkIds)));
    $report = Report::create([
      'gallery_id' => $this->firstGallery->id,
      'user_id' => 1,
      'type' => ReportType::Inventory->value,
      'name' => 'Inventory Report 2',
      'description' => $this->faker->paragraph,
      'options' => [
        'header' => $this->faker->boolean,
      ],
      'artworks' => $selectedIds,
      'created_at' => now()->subDays(2)->subHours(12),
    ]);
    (new ReportService($report))->generatePdf();

    $this->command->info('✅' . ' 5 artworks label reports and 2 inventory reports created for first gallery.');
  }

  private function createTaxes(): void
  {
    $this->command->comment('Creating taxes...');

    Tax::create([
      'gallery_id' => $this->firstGallery->id,
      'name' => 'GST',
      'rate' => 5.00,
      'description' => 'Goods and Services Tax.',
      'default' => false,
    ]);

    Tax::create([
      'gallery_id' => $this->firstGallery->id,
      'name' => 'PST',
      'rate' => 7.00,
      'description' => 'Provincial Sales Tax.',
      'default' => false,
    ]);

    Tax::create([
      'gallery_id' => $this->firstGallery->id,
      'name' => 'HST',
      'rate' => 13.00,
      'description' => 'Harmonized Sales Tax.',
      'default' => true,
    ]);

    $this->command->info('✅' . ' 3 Canadian taxes created for first gallery (GST, PST, HST).');
  }

  private function createInvoices(): void
  {
    $this->command->comment('Creating invoices...');

    Invoice::factory(10)->galleryId($this->firstGallery->id)->create();
    $invoicesToBePaid = Invoice::where('id', '<=', 7)->get();
    foreach ($invoicesToBePaid as $invoice) {
      $numberOfPayments = $this->faker->numberBetween(1, 3);
      $remainingAmount = $invoice->total;
      $minPaymentAmount = max(100, $invoice->total * 0.1);
      for ($i = 0; $i < $numberOfPayments; $i++) {
        if ($remainingAmount <= 0) {
          break;
        }
        if ($i === $numberOfPayments - 1 || $remainingAmount <= $minPaymentAmount) {
          $paymentAmount = $remainingAmount;
        } else {
          $paymentAmount = $this->faker->randomFloat(1, $minPaymentAmount, $remainingAmount);
        }

        Payment::create([
          'invoice_id' => $invoice->id,
          'user_id' => 1,
          'amount' => $paymentAmount,
          'payment_date' => $invoice->date->addDays($i + 1),
          'payment_method' => $this->faker->randomElement(PaymentMethod::cases())->value,
          'reference' => $this->faker->bothify('??-#####-######-??'),
          'notes' => $this->faker->sentence,
        ]);
        $remainingAmount -= $paymentAmount;
      }
    }
    $invoicesToBePartiallyPaid = Invoice::whereId(8)->get();
    foreach ($invoicesToBePartiallyPaid as $invoice) {
      Payment::create([
        'invoice_id' => $invoice->id,
        'user_id' => 1,
        'amount' => round($invoice->total * 0.5, -1),
        'payment_date' => $invoice->date->addDays(1),
        'payment_method' => $this->faker->randomElement(PaymentMethod::cases())->value,
        'reference' => $this->faker->bothify('??-#####-######-??'),
        'notes' => $this->faker->sentence,
      ]);
    }
    Invoice::find(10)->update(['status' => 'sent']);

    $this->command->info('✅' . ' 10 invoices created for first gallery.');
  }
}
