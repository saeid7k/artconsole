<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
  use HasFactory;

  protected $fillable = [
    'gallery_id',
    'type',
    'value',
  ];

  // Relationships

  public function gallery()
  {
    return $this->belongsTo(Gallery::class);
  }
}
