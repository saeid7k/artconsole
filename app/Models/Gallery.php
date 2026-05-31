<?php

namespace App\Models;

use App\Enums\ArtworkStatus;
use App\Enums\InvoiceStatus;
use App\Helpers\AddressHelper;
use App\Helpers\ConfigHelper;
use App\Helpers\FormatHelper;
use App\Helpers\LocationHelper;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Http;
use Laravel\Cashier\Billable;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Zoha\Metable;

class Gallery extends Model implements HasMedia
{
  use Metable, InteractsWithMedia, LogsActivity;
  use Billable {
    invoices as stripeInvoices;
  }

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
    'is_subscribed',
    'subscribed_price_id',
    'on_grace_period',
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
        $c = $this->getMeta('currency', ConfigHelper::getDefault('currency'));
        return $c == 'CAD' ? 'USD' : $c;
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

  public function getIsSubscribedAttribute(): bool
  {
    return $this->subscribed('default');
  }

  public function getSubscribedPriceIdAttribute(): ?string
  {
    $subscription = $this->subscription('default');
    return $subscription ? $subscription->stripe_price : null;
  }

  public function getOnGracePeriodAttribute(): bool
  {
    $subscription = $this->subscription('default');
    return $subscription ? $subscription->onGracePeriod() : false;
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

  public function setRandomLogo(): void
  {
    $logoData = Http::get("https://api.dicebear.com/9.x/shapes/svg?seed={$this->id}")->body() ?? null;
    if ($logoData) {
      $this->addMediaFromString($logoData)->usingFileName('gallery-' . $this->id . '-logo.svg')->toMediaCollection('gallery-logo');
    }
  }

  public function activeInventoryValue(?string $dateFrom = null): float
  {
    $query = $this->artworks()->active();

    if ($dateFrom) {
      $query->where('acquisition_date', '>=', $dateFrom);
    }

    return $query->sum('price');
  }

  public function revenue(?string $dateFrom = null, ?string $dateTo = null): float
  {
    $query = $this->invoices()
      ->whereIn('status', InvoiceStatus::activeValues());

    if ($dateFrom) {
      $query->where('date', '>=', $dateFrom);
    }

    if ($dateTo) {
      $query->where('date', '<=', $dateTo);
    }

    return $query->sum('subtotal');
  }

  public function pendingInvoicesCount(): float
  {
    return $this->invoices()
      ->whereIn('status', InvoiceStatus::pendingValues())
      ->count();
  }

  public function pendingInvoicesAmount(): float
  {
    return $this->invoices()
      ->whereIn('status', InvoiceStatus::pendingValues())
      ->sum('total');
  }

  public function saleCount(): float
  {
    return $this->artworks()
      ->where('status', 'sold')
      ->count();
  }

  public function saleCountInPeriod(?string $dateFrom = null, ?string $dateTo = null): float
  {
    $invoiceItems = InvoiceItem::whereNotNull('artwork_id')
      ->whereHas('invoice', function ($q) use ($dateFrom, $dateTo) {
        $q->where('gallery_id', $this->id)
          ->whereIn('status', InvoiceStatus::activeValues());

        if ($dateFrom) {
          $q->where('date', '>=', $dateFrom);
        }

        if ($dateTo) {
          $q->where('date', '<=', $dateTo);
        }
      })
      ->get();

    $uniqueArtworkIds = $invoiceItems->pluck('artwork_id')->unique();

    return $uniqueArtworkIds->count();
  }

  public function setCurrencyFromIp($ip = null): void
  {
    if (!$ip) {
      return;
    }

    $locationData = LocationHelper::getLocationFromIp($ip);

    if (!empty($locationData['countryCode'])) {
      $currency = LocationHelper::getCurrencyByCountryCode($locationData['countryCode']);
      if ($currency) {
        $this->setMeta('currency', $currency);
      }
    }
  }

  /*
  |=======================================================
  | Cashier Stripe Integration
  |=======================================================
  */

  public function stripeName(): string|null
  {
    return $this->getMeta('billing_to') == 'owner' ? $this->owner->full_name : $this->name;
  }

  public function stripeEmail(): string|null
  {
    return $this->getMeta('billing_to') == 'owner' ? $this->owner->email : $this->email;
  }

  public function stripeAddress(): array|null
  {
    $targetAddress = $this->getMeta('billing_to') == 'owner' ? $this->owner->address : $this->address;
    if (!$targetAddress) {
      return null;
    }

    return [
      'line1' => AddressHelper::lineOne($targetAddress),
      'line2' => null,
      'city' => $targetAddress->city ?? null,
      'state' => $targetAddress->province ?? null,
      'postal_code' => $targetAddress->postal_code ?? null,
      'country' => AddressHelper::countryToIso($targetAddress->country) ?? null,
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
