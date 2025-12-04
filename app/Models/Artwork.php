<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Artwork extends Model
{
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
    'edition' => 'object',
    'dimensions' => 'object',
    'styles' => 'array',
    'collections' => 'array',
    'details' => 'object',
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
}
