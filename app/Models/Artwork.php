<?php

namespace App\Models;

use App\Enums\ArtworkCategory;
use App\Enums\ArtworkEdition;
use App\Enums\ArtworkStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Artwork extends Model
{
  use HasFactory;

  protected $fillable = [
    'creator_id',
    'gallery_id',
    'location_id',
    'artist_id',
    'artist_data',
    'sku',
    'category',
    'edition',
    'title',
    'subject',
    'description',
    'year',
    'dimensions',
    'price',
    'medium',
    'styles',
    'collections',
    'details',
    'notes',
    'status',
  ];

  protected $casts = [
    'category' => 'string',
    'edition' => 'array',
    'dimensions' => 'object',
    'styles' => 'array',
    'collections' => 'array',
    'details' => 'object',
    'status' => 'string',
  ];

  // Attributes

  public function getArtistDataAttribute($value)
  {
    if ($this->artist_id) {
      return $this->artist;
    } else {
      return json_decode($value);
    }
  }

  public function setArtistDataAttribute($value)
  {
    $this->attributes['artist_data'] = json_encode($value);
  }

  // Relationships

  public function gallery()
  {
    return $this->belongsTo(Gallery::class);
  }

  public function location()
  {
    return $this->belongsTo(Location::class);
  }

  public function artist()
  {
    return $this->belongsTo(Contact::class, 'artist_id');
  }

  // Methods

  public function newSku(string $category): string
  {
    $prefix = ArtworkCategory::from($category)->code();
    $year = date('y');

    $latestArtwork = self::where('gallery_id', $this->gallery_id)->where('sku', 'like', "{$prefix}-{$year}-%")
      ->orderBy('sku', 'desc')
      ->first();

    if ($latestArtwork) {
      $parts = explode('-', $latestArtwork->sku);
      $number = (int) $parts[2] + 1;
    } else {
      $number = 1;
    }

    return sprintf("%s-%s-%03d", $prefix, $year, $number);
  }
}
