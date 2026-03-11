<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tax extends Model
{
  protected $fillable = [
    'gallery_id',
    'name',
    'abbreviation',
    'rate',
    'description',
    'tax_number',
    'default',
  ];

  protected $casts = [
    'default' => 'boolean',
  ];

  public function gallery() :BelongsTo
  {
    return $this->belongsTo(Gallery::class);
  }
}
