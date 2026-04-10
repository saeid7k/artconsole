<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\SoftDeletes;

class Invoice extends Model
{
  use HasFactory, SoftDeletes;

  protected $fillable = [
    'gallery_id',
    'user_id',
    'contact_id',
    'number',
    'date',
    'due_date',
    'shipping',
    'tax_id',
    'tax_rate',
    'subtotal',
    'available_extra_costs',
    'shipping_cost',
    'shipping_taxable',
    'discount_type', // ['percentage', 'fixed']
    'discount_rate',
    'discount_amount',
    'tax_amount',
    'total',
    'status',
    'notes',
  ];

  protected $casts = [
    'date' => 'date:Y-m-d',
    'due_date' => 'date:Y-m-d',
    'shipping' => 'object',
    'available_extra_costs' => 'object',
    'shipping_taxable' => 'boolean',
    /*
      'available_extra_costs' => [
        'shipping' => true,
        'discount' => false,
      ]
    */
  ];

  /*
  |=======================================================
  | Accessors & Mutators
  |=======================================================
  */

  protected $appends = ['invoice_number', 'amount_paid', 'amount_due', 'due_remaining_days', 'email_subject', 'pdf_file_name'];

  public function number() :Attribute
  {
    return Attribute::make(
      get: fn ($value) => str_pad($value, 5, '0', STR_PAD_LEFT),
      set: fn ($value) => str_pad($value, 5, '0', STR_PAD_LEFT)
    );
  }

  public function getInvoiceNumberAttribute(): string
  {
    return $this->gallery->invoice_prefix . $this->number;
  }

  public function getAmountPaidAttribute(): float
  {
    return $this->payments->sum('amount');
  }

  public function getAmountDueAttribute(): float
  {
    if ($this->status === 'paid') {
      return 0;
    }
    return $this->total - $this->amount_paid;
  }

  public function getDueRemainingDaysAttribute(): ?int
  {
    if (!$this->due_date) {
      return null;
    }

    $today = now()->startOfDay();
    $dueDate = $this->due_date->startOfDay();

    return $today->diffInDays($dueDate, false);
  }

  public function emailSubject(): Attribute
  {
    return Attribute::make(
      get: fn () => 'Invoice ' . $this->invoice_number . ' from ' . $this->gallery->name,
    );
  }

  public function pdfFileName(): Attribute
  {
    return Attribute::make(
      get: fn () => 'Invoice - ' . $this->invoice_number . '.pdf',
    );
  }

  /*
  |=======================================================
  | Relations
  |=======================================================
  */

  public function gallery(): BelongsTo
  {
    return $this->belongsTo(Gallery::class);
  }

  public function creator(): BelongsTo
  {
    return $this->belongsTo(User::class, 'user_id');
  }

  public function contact(): BelongsTo
  {
    return $this->belongsTo(Contact::class);
  }

  public function tax(): BelongsTo
  {
    return $this->belongsTo(Tax::class);
  }

  public function items(): HasMany
  {
    return $this->hasMany(InvoiceItem::class);
  }

  public function artworks(): HasManyThrough
  {
    return $this->hasManyThrough(Artwork::class, InvoiceItem::class, 'invoice_id', 'id', 'id', 'artwork_id')
      ->where('invoice_items.type', 'artwork');
  }

  public function payments(): HasMany
  {
    return $this->hasMany(Payment::class);
  }

  /*
  |--------------------------------------------------------------------------
  | Methods
  |--------------------------------------------------------------------------
  */

  public static function nextInvoiceNumber($gallery = null) :string
  {
    $gallery = $gallery ?? auth()->user()->currentGallery();
    $latestInvoice = self::where('gallery_id', $gallery->id)
      ->orderBy('number', 'desc')
      ->first();

    if ($latestInvoice) {
      return str_pad((int)$latestInvoice->number + 1, 5, '0', STR_PAD_LEFT);
    }

    return '00001';
  }

  public function calculateTotals()
  {
    $subtotal = $this->items->sum(function ($item) {
      return $item->quantity * $item->price;
    });
    $taxableSubtotal = $this->items->where('taxable', true)->sum(function ($item) {
      return $item->quantity * $item->price;
    });

    $shippingCost = $this->available_extra_costs?->shipping ? ($this->shipping_cost ?? 0) : 0;

    $grossTotal = $subtotal + $shippingCost;
    $taxableTotal = $taxableSubtotal + ($this->shipping_taxable ? $shippingCost : 0);

    $discountRate = $this->discount_rate ?? 0;
    $discountRatio = $this->available_extra_costs?->discount ?
      ($this->discount_type === 'percentage' ? $discountRate / 100 : $discountRate / $grossTotal)
      :
      0;
    $discountAmount = $this->discount_type === 'percentage' ? $discountRatio * $grossTotal : $discountRate;
    $discountOfTaxable = $discountRatio * $taxableTotal;

    $tax = ($taxableTotal - $discountOfTaxable) * ($this->tax_rate / 100);
    $total = $grossTotal - $discountAmount + $tax;

    $this->subtotal = $subtotal;
    $this->shipping_cost = $shippingCost;
    $this->discount_amount = $discountAmount;
    $this->tax_amount = $tax;
    $this->total = $total;

    return [
      'subtotal' => $subtotal,
      'shipping_cost' => $shippingCost,
      'discount_amount' => $discountAmount,
      'tax_amount' => $tax,
      'total' => $total,
    ];
  }

  /*
  |=======================================================
  | Scopes
  |=======================================================
  */

  public function scopeNotPaid(Builder $query)
  {
    $query->whereNotIn('status', ['paid', 'void']);
  }
}
