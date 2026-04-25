<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvoiceItem extends Model
{
  protected $fillable = [
    'invoice_id',
    'type',// ['artwork', 'custom']
    'artwork_id',
    'name',
    'description',
    'quantity',
    'price',
    'taxable',
  ];

  protected $casts = [
    'quantity' => 'integer',
    'price' => 'decimal:2',
    'taxable' => 'boolean',
  ];

  /*
  |=======================================================
  | Relationships
  |=======================================================
  */

  public function invoice(): BelongsTo
  {
    return $this->belongsTo(Invoice::class);
  }

  public function artwork(): BelongsTo
  {
    return $this->belongsTo(Artwork::class);
  }
}
