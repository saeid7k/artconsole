<?php

namespace App\Models;

use App\Enums\ArtworkCategory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Artwork extends Model implements HasMedia
{
  use HasFactory, InteractsWithMedia;

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
    'ownership',
    'owner_contact_id',
    'status',
    'details',
    'notes',
  ];

  protected $casts = [
    'edition' => 'object',
    'dimensions' => 'object',
    'styles' => 'array',
    'collections' => 'array',
    'details' => 'object',
  ];

  // Appends

  protected $appends = ['abilities', 'main_image_url', 'main_image_thumb_url'];

  public function getAbilitiesAttribute(): array
  {
    $user = auth()->user();
    return [
      'create' => $user->can('create', Artwork::class),
      'view' => $user->can('view', $this),
      'update' => $user->can('update', $this),
      'delete' => $user->can('delete', $this),
    ];
  }

  public function getMainImageUrlAttribute(): ?string
  {
    $media = $this->media()->where('collection_name', 'artwork-images')
      ->where('custom_properties->is_main', true)
      ->first();
    return $media ? $media->getUrl() : null;
  }

  public function getMainImageThumbUrlAttribute(): ?string
  {
    $media = $this->media()->where('collection_name', 'artwork-images')
      ->where('custom_properties->is_main', true)
      ->first();
    return $media ? $media->getUrl('thumb') : null;
  }

  // Attributes

  public function artistData(): Attribute
  {
    return new Attribute(
      get: function ($value) {
        if ($this->artist_id) {
          return $this->artist;
        } else {
          return json_decode($value);
        }
      },
      set: fn ($value) => json_encode($value),
    );
  }

  public function edition(): Attribute
  {
    return new Attribute(
      set: function ($value) {
        $value['type'] = $value['type'] ?? 'unique';
        if ($value['type'] === 'unique') {
          $value['number'] = 1;
          $value['size'] = 1;
        } elseif ($value['type'] === 'open') {
          $value['size'] = null;
          $value['number'] = (int) $value['number'];
        } else {
          $value['number'] = (int) $value['number'];
          $value['size'] = (int) $value['size'];
        }
        return json_encode($value);
      },
    );
  }

  public function dimensions(): Attribute
  {
    return new Attribute(
      set: function ($value) {
        $value['height'] = isset($value['height']) ? (float) $value['height'] : null;
        $value['width'] = isset($value['width']) ? (float) $value['width'] : null;
        $value['depth'] = isset($value['depth']) ? (float) $value['depth'] : null;
        return json_encode($value);
      },
    );
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

  public function creator()
  {
    return $this->belongsTo(User::class, 'creator_id');
  }

  public function artist()
  {
    return $this->belongsTo(Contact::class, 'artist_id');
  }

  public function owner()
  {
    return $this->belongsTo(Contact::class, 'owner_contact_id');
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

  public function registerMediaConversions(?Media $media = null): void
  {
    $this->addMediaConversion('thumb')
      ->width(200)
      ->height(200)
      ->sharpen(10)
      ->nonQueued();
  }

  public function getImagesAttribute()
  {
    return $this->media()
      ->where('collection_name', 'artwork-images')
      ->get();
  }
}
