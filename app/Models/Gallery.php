<?php

namespace App\Models;

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

  protected $appends = [ 'members_count', 'logo' ];

  public function getMembersCountAttribute()
  {
    return $this->members()->count();
  }

  public function getLogoAttribute(): ?string
  {
    $media = $this->getLastMedia('gallery-logo');
    return $media ? $media->getUrl() : null;
  }

  // Relationships

  public function owner()
  {
    return $this->belongsTo(User::class, 'user_id');
  }

  public function members()
  {
    $owner = $this->owner;

    $members = $this->belongsToMany(User::class, 'gallery_user')
      ->withPivot('access')
      ->withTimestamps()
      ->get();

    if ($owner && !$members->contains('id', $owner->id)) {
      $owner->pivot = ['access' => 'owner'];
      $members->push($owner);
    }

    return $members;
  }

  public function contacts(): HasMany
  {
    return $this->hasMany(Contact::class);
  }

  // Methods

  public function isMember(User $user)
  {
    return $this->members()->contains('id', $user->id);
  }

  public function accessLevel(User $user): string|null
  {
    return $this->members()
      ->where('id', $user->id)
      ->first()
      ?->pivot['access'] ?? null;
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
