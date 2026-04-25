<?php

namespace App\Services;

use App\Enums\ArtworkStatus;
use App\Enums\PaymentMethod;
use App\Enums\ReportType;
use App\Models\Contact;
use App\Models\Gallery;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Report;
use App\Models\User;
use Faker\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DemoUserService
{
  protected $faker;

  public function __construct(protected ?User $user = null)
  {
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

    // create taxes
    $this->createTaxes($gallery);

    // create invoices
    $this->createInvoices($gallery);
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
        'name' => 'Full Inventory Report',
        'artworks' => $artworkIds,
        'description' => 'Inventory report of all gallery artworks.',
      ],
      2 => [
        'name' => 'Primary Location Inventory Report',
        'artworks' => $gallery->locations()->first()->artworks()->pluck('id')->toArray(),
        'description' => 'Inventory report of artworks in the primary location.',
      ],
    ];

    foreach ($inventoryReportsData as $i => $reportData) {
      $report = Report::create([
        'gallery_id' => $gallery->id,
        'user_id' => $gallery->owner->id,
        'type' => ReportType::Inventory->value,
        'name' => $reportData['name'],
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
        'type' => ReportType::WallLabel->value,
        'name' => 'Label Report ' . ($i),
        'description' => $reportData['description'],
        'options' => $reportData['options'],
        'artworks' => $selectedIds,
        'created_at' => now()->subDays(20 - $i * 5),
      ]);
      (new ReportService($report))->generatePdf();
    }
  }


  private function createTaxes(Gallery $gallery): void
  {
    $gallery->taxes()->create([
      'name' => 'HST',
      'rate' => 13.00,
      'description' => 'Harmonized Sales Tax.',
      'default' => true,
    ]);

    $gallery->taxes()->create([
      'name' => 'GST + PST',
      'rate' => 12.00,
      'description' => 'Goods and Services Tax + Provincial Sales Tax.',
      'default' => false,
    ]);

    $gallery->taxes()->create([
      'name' => 'UK VAT',
      'rate' => 20.00,
      'description' => 'UK Value Added Tax.',
      'default' => false,
    ]);

    $gallery->taxes()->create([
      'name' => 'CA Sales Tax',
      'rate' => 9.50,
      'description' => 'California Sales Tax.',
      'default' => false,
    ]);

    $gallery->taxes()->create([
      'name' => 'AU GST',
      'rate' => 10.00,
      'description' => 'Australian Goods and Services Tax.',
      'default' => false,
    ]);

    $gallery->taxes()->create([
      'name' => 'Tax-Exempt',
      'rate' => 0.00,
      'description' => 'Tax-Exempt.',
      'default' => false,
    ]);
  }

  private function createInvoices(Gallery $gallery): void
  {
    $collectorsIds = $gallery->contacts()->whereJsonContains('relationship', 'collector')->pluck('id')->toArray();
    $taxId = $gallery->taxes()->first()->id;
    $taxRate = $gallery->taxes()->first()->rate;

    for ($i = 1; $i <= 5; $i++) {
      $date = now()->subDays(30 - $i * 5);
      Invoice::create([
        'gallery_id' => $gallery->id,
        'user_id' => $gallery->owner->id,
        'contact_id' => $collectorsIds[array_rand($collectorsIds)],
        'date' => $date,
        'due_date' => $date->copy()->addDays(30),
        'tax_id' => $taxId,
        'tax_rate' => $taxRate,
        'status' => $i == 5 ? 'draft' : 'sent',
      ]);
    }

    foreach ($gallery->invoices as $invoice) {
      $artworks = $gallery->artworks()
        ->where('status', '!=', ArtworkStatus::Sold->value)
        ->get();
      $itemsData = [];
      $numberOfArtworks = [1, 1, 2][rand(0, 2)];

      for ($j = 0; $j < $numberOfArtworks; $j++) {
        $artwork = $artworks->random();
        if (!$artwork) {
          continue;
        }
        $itemsData[] = [
          'type' => 'artwork',
          'artwork_id' => $artwork->id,
          'name' => 'Original Artwork',
          'description' => $artwork->invoice_description,
          'quantity' => 1,
          'price' => $artwork->price,
          'taxable' => true,
        ];
      }

      $itemsData[] = [
        'type' => 'custom',
        'name' => 'Framing',
        'description' => 'Custom framing for the artwork',
        'quantity' => $numberOfArtworks,
        'price' => 80.00,
        'taxable' => true,
      ];

      $invoice->items()->createMany($itemsData);
      $invoice->calculateTotals();
      $invoice->save();

      if ($invoice->date->isBefore(now()->subDays(16))) {
        $this->payInvoiceInFull($invoice);
      } elseif ($invoice->date->isBefore(now()->subDays(11))) {
        $this->payInvoicePartially($invoice);
      }
    }
  }

  private function payInvoiceInFull(Invoice $invoice): void
  {
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
        'user_id' => $invoice->user_id,
        'amount' => $paymentAmount,
        'payment_date' => $invoice->date->addDays($i + 1),
        'payment_method' => $this->faker->randomElement(PaymentMethod::cases())->value,
        'reference' => strtoupper($this->faker->bothify('??-#####-######-??')),
        'notes' => 'Payment ' . ($i + 1) . ' of ' . $numberOfPayments . ' for invoice #' . $invoice->invoice_number,
      ]);
      $remainingAmount -= $paymentAmount;
    }
  }

  private function payInvoicePartially(Invoice $invoice): void
  {
    $paymentAmount = round($invoice->total * 0.5, -1);
    Payment::create([
      'invoice_id' => $invoice->id,
      'user_id' => $invoice->user_id,
      'amount' => $paymentAmount,
      'payment_date' => $invoice->date->addDays(1),
      'payment_method' => $this->faker->randomElement(PaymentMethod::cases())->value,
      'reference' => strtoupper($this->faker->bothify('??-#####-######-??')),
      'notes' => 'Partial payment for invoice #' . $invoice->invoice_number,
    ]);
  }
}
