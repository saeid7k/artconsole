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
use Faker\Generator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DemoUserService
{
  protected Generator $faker;

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

    // add notes to contacts with sold or purchased arts
    $this->addContactNotes($gallery);
  }

  private function addArtworks(Gallery $gallery): void
  {
    $data = json_decode(file_get_contents(resource_path('demo/demo_artworks.json')), true);
    shuffle($data);

    $ownerId = $gallery->owner->id;
    $locationIds = $gallery->locations()->pluck('id')->toArray();
    $statuses = array_diff(ArtworkStatus::values(), ['sold']);

    foreach ($data as $index => $artworkData) {
      // add artwork
      $ownership = $this->faker->randomElement(['owned', 'owned', 'owned', 'consigned']);
      $artwork = $gallery->artworks()->create($artworkData + [
        'creator_id' => $ownerId,
        'location_id' => $locationIds[array_rand($locationIds)],
        'ownership' => $ownership,
        'acquisition_date' => $ownership == 'owned' ? now()->subDays(rand(365, 3650)) : null,
        'acquisition_price' => $ownership == 'owned' ? round($artworkData['price'] * rand(50, 90) / 100) : null,
        'commission_value' => $ownership == 'consigned' ? $this->faker->randomElement([30, 25, 20]) : 0,
        'status' => $statuses[array_rand($statuses)]
      ]);

      // add images
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

      // add notes
      $j = $j ?? 0;
      if ($index % 3 === 0 && $j < count($this->sampleNotes())) {
        $n = $artwork->addNote(
          $this->sampleNotes()[$j],
          $ownerId
        );
        $randomDate = now()->subDays(rand(1, 10))->subMinutes(rand(1, 1440));
        $n->update([
          'created_at' => $randomDate,
          'updated_at' => $randomDate,
        ]);
        $j++;
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
          'checkbox' => true,
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

    for ($i = 1; $i <= 7; $i++) {
      $date = now()->subDays(60 - $i * 8);
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

      if ($invoice->date->isBefore(now()->subDays(25))) {
        $this->payInvoiceInFull($invoice);
      } elseif ($invoice->date->isBefore(now()->subDays(12))) {
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

  private function addContactNotes(Gallery $gallery): void
  {
    $ownerId = $gallery->owner->id;
    $notes = $this->sampleContactNotes();
    $noteIndex = 0;

    $contacts = $gallery->contacts()
      ->where(function ($q) {
        $q->whereHas('soldArts')
          ->orWhereHas('purchasedArts');
      })
      ->get();

    foreach ($contacts as $contact) {
      $numberOfNotes = rand(1, 2);
      for ($i = 0; $i < $numberOfNotes; $i++) {
        $n = $contact->addNote($notes[$noteIndex % count($notes)], $ownerId);
        $randomDate = now()->subDays(rand(1, 30))->subMinutes(rand(1, 1440));
        $n->update([
          'created_at' => $randomDate,
          'updated_at' => $randomDate,
        ]);
        $noteIndex++;
      }
    }
  }

  private function sampleNotes(): array
  {
    return [
      "Potential buyer (David L.) requested a private viewing before the OCEAN GALLERY spring exhibition officially opens. He specifically asked about the abstract background techniques, noting he loves how there is no realism in the foreground. Viewing scheduled for next Tuesday at 2 PM.",
      "Sent to the framer this morning. We opted for a custom matte black float frame to better highlight the delicate textures and precise pencil work without overpowering the piece. Expected back in the gallery inventory by Thursday.",
      "Susie advised that this piece must be displayed away from direct UV light to prevent any fading of the high-quality soft pastels used in the underlayer. It has been assigned to the north wall of the main viewing room.",
      "Condition report completed prior to transit. There is a very minor scuff on the bottom left edge of the temporary gallery frame, but the canvas itself is in pristine condition. Custom crated, insured, and shipped out this morning.",
      "Final layer of retouch varnish applied. The specific oil painting techniques utilized on this canvas required an extended drying period, so we've postponed the official catalog photography until the 15th. It will be marked as 'Available' in the system once the high-res photos are uploaded."
    ];
  }

  private function sampleContactNotes(): array
  {
    return [
      "Met at the Spring Exhibition opening. Very interested in acquiring more abstract works. Prefers pieces in the 24×36 inch range and leans toward cool, muted tones. Follow up in two weeks with new arrivals.",
      "Collector has expressed strong interest in consigning two pieces from her personal collection. Discussed a 30% commission rate. Awaiting her confirmation before drafting the consignment agreement.",
      "Artist confirmed availability for an exclusive solo show in November. Requires a minimum of 15 new works by end of September. Studio visit arranged for next Friday to review works in progress.",
      "Called regarding the delayed shipment of her last purchase. The crate arrived with minor cosmetic damage to the outer packaging, but the artwork itself is in perfect condition. She was understanding and satisfied with the outcome.",
      "Long-standing client — has purchased multiple pieces over the past three years. Birthday coming up on March 22nd; consider sending a personalized note and a preview of upcoming acquisitions.",
      "First-time buyer referred by a collector circle member. Showed keen interest in limited-edition prints. Scheduled a private viewing for two upcoming series. Strong potential for a long-term collecting relationship.",
    ];
  }
}
