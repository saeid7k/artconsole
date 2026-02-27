<?php

namespace App\Models;

use App\Casts\TimezoneAwareDatetime;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Report extends Model implements HasMedia
{
  use InteractsWithMedia;

  protected $fillable = [
    'gallery_id',
    'user_id',
    'type',
    'name',
    'description',
    'options',
    'artworks',
  ];

  protected function casts(): array
  {
    return [
      'options' => 'object',
      'artworks' => 'array',
      // 'created_at' => TimezoneAwareDatetime::class . ':Y-m-d H:i:s',
    ];
  }

  public function gallery(): BelongsTo
  {
    return $this->belongsTo(Gallery::class);
  }

  public function creator(): BelongsTo
  {
    return $this->belongsTo(User::class, 'user_id');
  }
}
