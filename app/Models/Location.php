<?php

namespace App\Models;

use App\Helpers\AddressHelper;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
  protected $fillable = [
    'gallery_id',
    'type', // internal | external | venue | contact
    'contact_id',
    'name',
    'description',
    'phone',
    'email',
    'address',
    'address_same_as_gallery',
    'is_primary',
    'is_active',
  ];

  protected $casts = [
    'address' => 'object',
    'address_same_as_gallery' => 'boolean',
    'is_primary' => 'boolean',
    'is_active' => 'boolean',
  ];

  // Appends

  protected $appends = [ 'abilities', 'formatted_address' ];

  public function getAbilitiesAttribute()
  {
    return [
      'create' => auth()->user()->can('create', $this),
      'update' => auth()->user()->can('update', $this),
      'delete' => auth()->user()->can('delete', $this),
    ];
  }

  public function getFormattedAddressAttribute(): string
  {
    return AddressHelper::formatAddress($this->address);
  }

  // Attributes

  public function getAddressAttribute($value)
  {
    if ($this->address_same_as_gallery) {
      return $this->gallery ? $this->gallery->address : null;
    }
    return $value ? json_decode($value) : null;
  }

  public function setAddressAttribute(object|array|null $value)
  {
    $this->attributes['address'] = $value ? json_encode($value) : null;
  }

  // Relationships

  public function gallery()
  {
    return $this->belongsTo(Gallery::class);
  }

  public function contact()
  {
    return $this->contact_id ? $this->belongsTo(Contact::class) : null;
  }

  public function artworks()
  {
    return $this->hasMany(Artwork::class);
  }

  // Methods

  public function artworksImagesUrls($conversionName = null, $limit = null): array
  {
    $artworks = $this->artworks()->limit($limit)->get();
    $images = $artworks->map(function ($artwork) use ($conversionName) {
      $media = $artwork->mainImage;
      if ($media) {
        return $media->getUrl($conversionName);
      }
      return null;
    });

    return $images->toArray();
  }

  public function isTheOnlyActiveLocation(): bool
  {
    $activeLocationsCount = Location::where('gallery_id', $this->gallery_id)
      ->where('is_active', true)
      ->count();

    return $activeLocationsCount === 1 && $this->is_active;
  }

  // Scopes

  public function scopeActive($query)
  {
    return $query->where('is_active', true);
  }
}
