<?php

namespace Database\Factories;

use App\Enums\InvoiceStatus;
use App\Models\Artwork;
use App\Models\Gallery;
use App\Models\Invoice;
use Carbon\Carbon;
use Closure;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Invoice>
 */
class InvoiceFactory extends Factory
{
  protected static array $invoiceNumbers = [];
  protected static ?Carbon $currentDate = null;

  public function definition(): array
  {
    $gallery = Gallery::find(1);
    $tax = $gallery->taxes()->inRandomOrder()->first();
    if (static::$currentDate === null) {
      static::$currentDate = Carbon::parse($this->faker->dateTimeInInterval('-1 month', '+2 days'));
    } else {
      static::$currentDate->addDays(2);
    }
    $dueDate = static::$currentDate->copy()->addMonth();

    return [
      'gallery_id' => $gallery->id,
      'user_id' => 1,
      'contact_id' => 1,
      'number' => function (array $attributes) {
        $galleryId = $attributes['gallery_id'];
        if (!isset(static::$invoiceNumbers[$galleryId])) {
          $currentGallery = Gallery::find($galleryId);
          static::$invoiceNumbers[$galleryId] = (int) Invoice::nextInvoiceNumber($currentGallery);
        } else {
          static::$invoiceNumbers[$galleryId]++;
        }
        return static::$invoiceNumbers[$galleryId];
      },
      'date' => static::$currentDate->format('Y-m-d'),
      'due_date' => $dueDate->format('Y-m-d'),
      'tax_id' => $tax->id,
      'tax_rate' => $tax->rate,
      'status' => $this->faker->randomElement(['draft', 'sent']),
      'notes' => $this->faker->paragraph,
    ];
  }

  public function galleryId(int $galleryId): static
  {
    return $this->state(function (array $attributes) use ($galleryId) {
      $gallery = Gallery::find($galleryId);
      $contact = $gallery->contacts()->inRandomOrder()->first();
      return [
        'gallery_id' => $gallery->id,
        'contact_id' => $contact->id,
      ];
    });
  }

  public function configure(): static
  {
    return $this->afterCreating(function (Invoice $invoice) {
      $artwork = Artwork::where('gallery_id', $invoice->gallery_id)->inRandomOrder()->first();
      $invoice->items()->createMany([
        [
          'type' => 'artwork',
          'artwork_id' => $artwork->id,
          'name' => 'Original Artwork',
          'description' => $artwork->invoice_description,
          'quantity' => 1,
          'price' => $artwork->price,
          'taxable' => true,
        ],
        [
          'type' => 'custom',
          'name' => 'Framing',
          'description' => 'Custom framing for the artwork',
          'quantity' => 1,
          'price' => 100.00,
          'taxable' => true,
        ],
      ]);
      $invoice->calculateTotals();
      $invoice->save();
    });
  }
}
