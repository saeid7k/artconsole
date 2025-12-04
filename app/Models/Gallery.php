<?php

namespace App\Models;

use App\Helpers\AddressHelper;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Zoha\Metable;

class Gallery extends Model implements HasMedia
{
  use Metable, InteractsWithMedia, LogsActivity;

  protected $fillable = [
    'name',
    'about',
    'address',
    'website',
    'email',
  ];

  protected $casts = [
    'address' => 'object',
  ];

  // Appends

  protected $appends = [ 'abilities', 'members_count', 'logo', 'formatted_address' ];

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

  public function getLogoAttribute(): ?string
  {
    $media = $this->getLastMedia('gallery-logo');
    return $media ? $media->getUrl() : null;
  }

  public function getFormattedAddressAttribute(): string
  {
    return AddressHelper::formatAddress($this->address);
  }

  // Relationships

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

  public function invitations(): HasMany
  {
    return $this->hasMany(InviteLink::class);
  }

  public function locations(): HasMany
  {
    return $this->hasMany(Location::class);
  }

  // Methods

  public function isMember(User $user)
  {
    return $this->members()->get()->contains('id', $user->id);
  }

  public function accessLevel(User $user): string|null
  {
    $member = $this->members->firstWhere('id', $user->id);
    return $member?->pivot->access ?? null;
  }

  public function isEditorOrOwner(User $user): bool
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
