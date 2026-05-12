<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Helpers\AddressHelper;
use App\Helpers\ConfigHelper;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Http;
use Laravel\Cashier\Billable;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Zoha\Metable;

class User extends Authenticatable implements HasMedia, MustVerifyEmail
{
  /** @use HasFactory<\Database\Factories\UserFactory> */

  use HasFactory, Notifiable, Metable, InteractsWithMedia, LogsActivity, SoftDeletes;
  use Billable {
    invoices as stripeInvoices;
  }
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
    'country_code',
    'phone',
    'website',
    'address',
    'bio',
    'token_balance',
    'is_demo',
    'demo_claimed_at',
    'social_auth_id',
    'email_verified_at',
    'password',
  ];

  /**
   * The attributes that should be hidden for serialization.
   *
   * @var list<string>
   */
  protected $hidden = [
    'password',
    'remember_token',
    'social_auth_id',
  ];

  /**
   * Get the attributes that should be cast.
   *
   * @return array<string, string>
   */
  protected function casts(): array
  {
    return [
      'is_demo' => 'boolean',
      'demo_claimed_at' => 'datetime',
      'email_verified_at' => 'datetime',
      'password' => 'hashed',
      'address' => 'object',
      'social_auth_id' => 'array',
    ];
  }

  /*
  |=======================================================
  | Accessors & Mutators
  |=======================================================
  */

  protected $appends = ['abilities', 'full_name', 'is_admin', 'formatted_address', 'photo', 'has_password', 'timezone', 'access', 'has_edit_access'];

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

  public function getHasPasswordAttribute(): bool
  {
    return !is_null($this->password);
  }

  public function getTimezoneAttribute(): ?string
  {
    return $this->getMeta('timezone') ?? config('app.timezone');
  }

  public function getAccessAttribute()
  {
    $currentGallery = $this->currentGallery();
    if (!$currentGallery) {
      return null;
    }

    return $currentGallery->pivot->access ?? null;
  }

  public function getHasEditAccessAttribute(): bool
  {
    $currentGallery = $this->currentGallery();
    if (!$currentGallery) {
      return false;
    }

    return $currentGallery->hasEditAccess($this);
  }

  /*
  |=======================================================
  | Relationships
  |=======================================================
  */

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
    $galleryId = $this->getMeta('current_gallery_id') ?? null;
    if (!$galleryId) {
      $galleryId = $this->galleries()->first()?->id;
      $this->setCurrentGallery($galleryId);
    }

    $found =  $this->belongsToMany(Gallery::class, 'gallery_user')
      ->withPivot('access')
      ->where('galleries.id', $galleryId)
      ->first();

    if ($found) {
      return $found;
    } else {
      $newGallery = $this->galleries()->first();
      $this->setCurrentGallery($newGallery?->id);
      return $this->belongsToMany(Gallery::class, 'gallery_user')
        ->withPivot('access')
        ->where('galleries.id', $newGallery?->id)
        ->first();
    }
  }

  public function invitations(): HasMany
  {
    return $this->hasMany(InviteLink::class);
  }

  public function invitedTo()
  {
    return $this->hasMany(InviteLink::class, 'email', 'email');
  }

  public function notes(): HasMany
  {
    return $this->hasMany(Note::class);
  }

  public function invoices(): HasMany
  {
    return $this->hasMany(Invoice::class);
  }

  public function contacts(): HasMany
  {
    return $this->hasMany(Contact::class);
  }

  public function payments(): HasMany
  {
    return $this->hasMany(Payment::class);
  }

  public function tokenTransactions(): HasMany
  {
    return $this->hasMany(TokenTransaction::class);
  }

  /*
  |=======================================================
  | Methods
  |=======================================================
  */

  public function is_admin()
  {
    return $this->id == 1;
  }

  public function setCurrentGallery($galleryId = null)
  {
    if (!$galleryId) {
      $newCurrentGallery = $this->galleries()->first();
      $this->setMeta('current_gallery_id', $newCurrentGallery?->id);
      return;
    }

    $this->setMeta('current_gallery_id', $galleryId);
  }

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

  public function setRandomAvatar(int $size = 500)
  {
    $photoData = Http::get("https://i.pravatar.cc/{$size}")->body() ?? null;
    if ($photoData) {
      $this->addMediaFromString($photoData)->usingFileName('user-' . $this->id . '-photo.jpg')->toMediaCollection('profile-photo');
    }
  }

  public function setTimezoneFromAddress(): void
  {
    $formattedAddress = $this->formatted_address;
    if ($formattedAddress) {
      $geocode = AddressHelper::addressToGeocode($formattedAddress);
      if ($geocode && isset($geocode['timezone'])) {
        $this->setMeta('timezone', $geocode['timezone']);
      }
    }
  }

  public function increaseTokens(int $amount): void
  {
    $this->token_balance += $amount;
    $this->save();
  }

  public function decreaseTokens(int $amount): void
  {
    $this->token_balance -= $amount;
    $this->save();
  }

  public function creditFreeTokens(?int $amount, ?string $description): void
  {
    $this->tokenTransactions()->create([
      'type' => 'credit',
      'amount' => $amount ?? ConfigHelper::tokens('free_monthly_tokens'),
      'description' => $description ?? 'Free token credit',
    ]);
  }

  /*
  |=======================================================
  | Scopes
  |=======================================================
  */

  public function scopeVerified(Builder $query): void
  {
    $query->whereNotNull('email_verified_at');
  }

  public function scopeUnverified(Builder $query): void
  {
    $query->whereNull('email_verified_at');
  }

  /*
  |=======================================================
  | Cashier Stripe Integration
  |=======================================================
  */

  public function stripeName(): string|null
  {
    return $this->full_name;
  }

  public function stripeEmail(): string|null
  {
    return $this->email;
  }

  public function stripeAddress(): array|null
  {
    if (!$this->address) {
      return null;
    }
    return [
      'line1' => AddressHelper::lineOne($this->address),
      'line2' => null,
      'city' => $this->address->city ?? null,
      'state' => $this->address->province ?? null,
      'postal_code' => $this->address->postal_code ?? null,
      'country' => AddressHelper::countryToIso($this->address->country) ?? null,
    ];
  }
}
