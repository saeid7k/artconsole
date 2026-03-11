<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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

  public function gallery() :BelongsTo
  {
    return $this->belongsTo(Gallery::class);
  }

  public function creator() :BelongsTo
  {
    return $this->belongsTo(User::class, 'user_id');
  }

  public function contact() :BelongsTo
  {
    return $this->belongsTo(Contact::class);
  }

  public function tax() :BelongsTo
  {
    return $this->belongsTo(Tax::class);
  }
}
