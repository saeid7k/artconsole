<?php

namespace App\Models;

use App\Helpers\AddressHelper;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Contact extends Model implements HasMedia
{
  use HasFactory, InteractsWithMedia;

  protected $casts = [
    'address' => 'object',
    'business' => 'object',
    'birthday' => 'date',
    'relationship' => 'array',
  ];

  // Appends

  protected $appends = ['abilities', 'full_name', 'formatted_address', 'business_formatted_address', 'photo'];

  public function getAbilitiesAttribute(): array
  {
    return [
      'delete' => auth()->user()->can('delete', $this),
    ];
  }

  public function getFullNameAttribute(): string
  {
    return trim($this->firstname . ' ' . $this->lastname);
  }

  public function getFormattedAddressAttribute(): string
  {
    return AddressHelper::formatAddress($this->address);
  }

  public function getBusinessFormattedAddressAttribute(): string
  {
    return AddressHelper::formatAddress($this->business?->address ?? null);
  }

  public function getPhotoAttribute(): ?string
  {
    $media = $this->getLastMedia('contact_photo');
    return $media ? $media->getUrl() : null;
  }

  // Relationships

  public function gallery()
  {
    return $this->belongsTo(Gallery::class, 'gallery_id');
  }

  public function owner()
  {
    return User::find($this->gallery->user_id);
  }
}
