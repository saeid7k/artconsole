<?php

namespace App\Models;

use App\Helpers\AddressHelper;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
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
    'email',
    'phone',
    'address',
    'website',
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
    $media = $this->getLastMedia('contact-photo');
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

  // Activity Log

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
