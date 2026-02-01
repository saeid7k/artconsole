<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Note extends Model
{
  protected $fillable = [
    'user_id',
    'note',
  ];

  // Relationships

  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }

  public function artworks(): BelongsToMany
  {
    return $this->belongsToMany(Artwork::class, 'artwork_note')
      ->withTimestamps();
  }
}
