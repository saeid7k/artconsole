<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Str;

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

  protected $appends = [
    'noteable_path',
  ];

  /*
  |=======================================================
  | Accessors & Mutators
  |=======================================================
  */

  public function noteablePath(): Attribute | null
  {
    return new Attribute(
      get: function () {
        if (!$this->noteable_type || !$this->noteable_id) {
          return null;
        }
        $segment = Str::plural(Str::snake(class_basename($this->noteable_type)));
        return "/{$segment}/{$this->noteable_id}";
      }
    );
  }

  /*
  |=======================================================
  | Methods
  |=======================================================
  */

  public function collaborators()
  {
    return User::whereIn('id', $this->collaborators_ids ?? [])
      ->select('id', 'firstname', 'lastname')
      ->get()
      ->setAppends(['full_name', 'photo', 'photo_thumb', 'photo_small']);
  }

  /*
  |=======================================================
  | Relationships
  |=======================================================
  */

  public function creator(): BelongsTo
  {
    return $this->belongsTo(User::class, 'user_id');
  }

  public function noteable(): MorphTo
  {
    return $this->morphTo();
  }
}
