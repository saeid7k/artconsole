<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
  protected $fillable = [
    'invoice_id',
    'user_id',
    'amount',
    'payment_date',
    'payment_method',
    'reference',
    'notes',
  ];

  protected $casts = [
    'payment_date' => 'date:Y-m-d',
  ];

  public function invoice(): BelongsTo
  {
    return $this->belongsTo(Invoice::class);
  }

  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }
}
