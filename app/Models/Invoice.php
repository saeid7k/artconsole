<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Invoice extends Model
{
  protected $fillable = [
    'gallery_id',
    'user_id',
    'contact_id',
    'number',
    'date',
    'due_date',
    'tax_id',
    'tax_name',
    'tax_rate',
    'shipping',
    'subtotal',
    'tax_amount',
    'total',
    'status',
    'notes',
  ];

  protected $casts = [
    'date' => 'date',
    'due_date' => 'date',
    'shipping' => 'object',
  ];

  /*
  |--------------------------------------------------------------------------
  | Accessors & Mutators
  |--------------------------------------------------------------------------
  */

  public function number() :Attribute
  {
    return Attribute::make(
      get: fn ($value) => str_pad($value, 5, '0', STR_PAD_LEFT),
      set: fn ($value) => str_pad($value, 5, '0', STR_PAD_LEFT)
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Relationships
  |--------------------------------------------------------------------------
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
}
