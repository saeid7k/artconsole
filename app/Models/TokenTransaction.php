<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TokenTransaction extends Model
{
  protected $fillable = [
    'type',
    'amount',
    'description',
  ];

  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }
}
