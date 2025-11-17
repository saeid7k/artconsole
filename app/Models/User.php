<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Helpers\AddressHelper;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Zoha\Metable;

class User extends Authenticatable implements HasMedia, MustVerifyEmail
{
  /** @use HasFactory<\Database\Factories\UserFactory> */

  use HasFactory, Notifiable, Metable, InteractsWithMedia, LogsActivity, Notifiable;
  /**
   * The attributes that are mass assignable.
   *
   * @var list<string>
   */

  protected $fillable = [
    'firstname',
    'lastname',
    'username',
    'email',
    'phone',
    'website',
    'address',
    'bio',
    'password',
  ];

  protected $guarded = [
    'email_verified_at',
    'remember_token',
    'created_at',
    'updated_at',
  ];

  /**
   * The attributes that should be hidden for serialization.
   *
   * @var list<string>
   */
  protected $hidden = [
    'password',
    'remember_token',
  ];

  /**
   * Get the attributes that should be cast.
   *
   * @return array<string, string>
   */
  protected function casts(): array
  {
    return [
      'email_verified_at' => 'datetime',
      'password' => 'hashed',
      'address' => 'object',
    ];
  }

  // Appends

  protected $appends = ['abilities', 'full_name', 'is_admin', 'formatted_address', 'photo'];

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

  public function getIsAdminAttribute(): bool
  {
    return $this->id == 1;
  }

  public function getFormattedAddressAttribute(): string
  {
    return AddressHelper::formatAddress($this->address);
  }

  public function getPhotoAttribute(): ?string
  {
    $media = $this->getLastMedia('profile-photo');
    return $media ? $media->getUrl() : null;
  }

  // Relations

  public function galleriesOwned(): HasMany
  {
    return $this->hasMany(Gallery::class);
  }

  public function galleries()
  {
    $owned = $this->galleriesOwned()->get();

    $shared = $this->belongsToMany(Gallery::class, 'gallery_user')
      ->select('galleries.id', 'galleries.name')
      ->withPivot('access')
      ->withTimestamps()
      ->get();

    return $owned->merge($shared);
  }

  public function currentGallery()
  {
    return Gallery::whereId($this->getMeta('current_gallery_id'))->first();
  }

  public function invitations(): HasMany
  {
    return $this->hasMany(InviteLink::class);
  }

  // Methods

  public function is_admin()
  {
    return $this->id == 1;
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
            return "created the user";
          case 'updated':
            return "updated user information";
          case 'deleted':
            return "deleted the user";
          default:
            return $event;
        }
      });
  }
}
