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

  protected $appends = [ 'formatted_address' ];

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
    $this->attributes['address'] = json_encode($value);
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

  // Scopes

  public function scopeActive($query)
  {
    return $query->where('is_active', true);
  }
}
