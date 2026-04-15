<?php

namespace App\Models;

use App\Helpers\AddressHelper;
use App\Helpers\ConfigHelper;
use App\Helpers\FormatHelper;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Cashier\Billable;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Zoha\Metable;

class Gallery extends Model implements HasMedia
{
  use Metable, InteractsWithMedia, LogsActivity, Billable;

  protected $fillable = [
    'name',
    'about',
    'address',
    'country_code',
    'phone',
    'website',
    'email',
  ];

  protected $casts = [
    'address' => 'object',
  ];

  /*
  |=======================================================
  | Accessors & Mutators
  |=======================================================
  */

  protected $appends = [
    'abilities',
    'currency',
    'invoice_prefix',
    'logo_url',
    'formatted_address',
    'formatted_phone_number',
    'members_count',
    'meta',
  ];

  public function getAbilitiesAttribute()
  {
    return [
      'update' => auth()->user()->can('update', $this),
      'delete' => auth()->user()->can('delete', $this),
      'manage_members' => auth()->user()->can('manageMembers', $this),
    ];
  }

  public function getMembersCountAttribute()
  {
    return $this->members()->count();
  }

  public function getLogoUrlAttribute(): ?string
  {
    $media = $this->logo();
    return $media ? $media->getUrl() : null;
  }

  public function getFormattedAddressAttribute(): string
  {
    return AddressHelper::formatAddress($this->address);
  }

  public function getMetaAttribute()
  {
    return $this->getMetas();
  }

  public function currency(): Attribute
  {
    return Attribute::make(
      get: function () {
        return $this->getMeta('currency', ConfigHelper::getDefault('currency'));
      },
      set: function ($value) {
        $this->setMeta('currency', $value);
        return $value;
      }
    );
  }

  public function invoicePrefix(): Attribute
  {
    return Attribute::make(
      get: function () {
        return $this->getMeta('invoice_prefix', ConfigHelper::getDefault('invoice_prefix'));
      },
      set: function ($value) {
        $this->setMeta('invoice_prefix', $value);
        return $value;
      }
    );
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

  public function owner()
  {
    return $this->belongsTo(User::class, 'user_id');
  }

  public function members()
  {
    return $this->belongsToMany(User::class, 'gallery_user')->withPivot('access');
  }

  public function contacts(): HasMany
  {
    return $this->hasMany(Contact::class);
  }

  public function artists(): HasMany
  {
    return $this->hasMany(Contact::class)->whereJsonContains('relationship', 'artist');
  }

  public function invitations(): HasMany
  {
    return $this->hasMany(InviteLink::class);
  }

  public function locations(): HasMany
  {
    return $this->hasMany(Location::class);
  }

  public function primaryLocation()
  {
    return $this->hasOne(Location::class)->where('is_primary', true);
  }

  public function artworks(): HasMany
  {
    return $this->hasMany(Artwork::class);
  }

  public function tags(): HasMany
  {
    return $this->hasMany(Tag::class)
      ->orWhereNull('gallery_id');
  }

  public function reports(): HasMany
  {
    return $this->hasMany(Report::class);
  }

  public function taxes(): HasMany
  {
    return $this->hasMany(Tax::class);
  }

  public function invoices(): HasMany
  {
    return $this->hasMany(Invoice::class);
  }

  /*
  |=======================================================
  | Methods
  |=======================================================
  */

  public function logo()
  {
    return $this->getLastMedia('gallery-logo');
  }

  public function isMember(User $user)
  {
    return $this->members()->get()->contains('id', $user->id);
  }

  public function accessLevel(User $user): string|null
  {
    $member = $this->members->firstWhere('id', $user->id);
    return $member?->pivot->access ?? null;
  }

  public function hasEditAccess(User $user): bool
  {
    $accessLevel = $this->accessLevel($user);
    return in_array($accessLevel, ['owner', 'editor']);
  }

  public function addMember(User $user, ?string $access = 'viewer'): void
  {
    $this->members()->attach($user->id, [
      'access' => $access,
      'created_at' => now(),
      'updated_at' => now(),
    ]);
  }

  public function fillDefaultPaymentMethod(): void
  {
    $paymentMethod = $this->paymentMethods()->first();

    if ($paymentMethod && !$this->hasDefaultPaymentMethod()) {
      $this->updateDefaultPaymentMethod($paymentMethod->id);
    }
  }

  /*
  |=======================================================
  | Cashier Stripe Integration
  |=======================================================
  */

  public function stripeName(): string|null
  {
    return $this->name;
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
            return "created the gallery";
          case 'updated':
            return "updated gallery information";
          case 'deleted':
            return "deleted the gallery";
          default:
            return $event;
        }
      });
  }
}
