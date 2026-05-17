<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Note extends Model
{
  protected $fillable = [
    'gallery_id',
    'user_id',
    'content',
    'collaborators_ids',
  ];

  protected $casts = [
    'collaborators_ids' => 'array',
  ];

  // Methods

  public function collaborators()
  {
    return User::whereIn('id', $this->collaborators_ids ?? [])->get();
  }

  // Relationships

  public function creator(): BelongsTo
  {
    return $this->belongsTo(User::class, 'user_id');
  }

  public function noteable(): MorphTo
  {
    return $this->morphTo();
  }
}
