<?php

namespace App\Models;

use App\Helpers\AddressHelper;
use App\Helpers\FormatHelper;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Contact extends Model implements HasMedia
{
  use HasFactory, InteractsWithMedia, LogsActivity, SoftDeletes;

  protected $fillable = [
    'gallery_id',
    'firstname',
    'lastname',
    'address',
    'country_code',
    'phone',
    'website',
    'email',
    'relationship',
    'business',
    'birthday',
  ];

  protected $casts = [
    'address' => 'object',
    'business' => 'object',
    'business.address' => 'object',
    'birthday' => 'date:Y-m-d',
    'relationship' => 'array',
  ];

  /*
  |=======================================================
  | Accessors & Mutators
  |=======================================================
  */

  protected $appends = ['abilities', 'full_name', 'formatted_address', 'business_formatted_address', 'photo', 'formatted_phone_number'];

  public function getAbilitiesAttribute(): array
  {
    $user = auth()->user();
    if (!$user) {
      return [];
    }
    return [
      'update' => $user->can('update', $this),
      'delete' => $user->can('delete', $this),
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
    $media = $this->getLastMedia('contact-photo');
    return $media ? $media->getUrl() : null;
  }

  public function phone(): Attribute
  {
    return Attribute::make(
      get: fn ($value) => $value,
      set: function ($value) {
        $cleanedValue = preg_replace('/[^0-9+]/', '', $value);
        return $cleanedValue;
      }
    );
  }

  public function getFormattedPhoneNumberAttribute(): string
  {
    return FormatHelper::formatPhoneNumber($this->phone, $this->country_code);
  }

  /*
  |=======================================================
  | Relationships
  |=======================================================
  */

  public function gallery()
  {
    return $this->belongsTo(Gallery::class, 'gallery_id');
  }

  public function creator(): BelongsTo
  {
    return $this->belongsTo(User::class, 'user_id');
  }

  public function artworks()
  {
    return $this->hasMany(Artwork::class);
  }

  public function invoices() :HasMany
  {
    return $this->hasMany(Invoice::class);
  }

  /*
  |=======================================================
  | Activity Log
  |=======================================================
  */

  public function getActivitylogOptions(): LogOptions
  {
    return LogOptions::defaults()
      ->logFillable()
      ->logOnlyDirty()
      ->dontSubmitEmptyLogs()
      ->setDescriptionForEvent(function (string $event) {
        switch ($event) {
          case 'created':
            return "created the contact";
          case 'updated':
            return "updated contact information";
          case 'deleted':
            return "deleted the contact";
          default:
            return $event;
        }
      });
  }
}
