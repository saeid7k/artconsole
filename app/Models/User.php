<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Zoha\Metable;

class User extends Authenticatable
{
  /** @use HasFactory<\Database\Factories\UserFactory> */

  use HasFactory, Notifiable, Metable;
  /**
   * The attributes that are mass assignable.
   *
   * @var list<string>
   */
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
    ];
  }

  protected $appends = ['full_name'];

  public function getFullNameAttribute(): string
  {
    return trim($this->firstname . ' ' . $this->lastname);
  }

  public function galleriesOwned(): HasMany
  {
    return $this->hasMany(Gallery::class);
  }

  public function galleries()
  {
    $owned = $this->galleriesOwned()->get();

    $shared = $this->belongsToMany(Gallery::class, 'gallery_user')
      ->withPivot('access')
      ->withTimestamps()
      ->get();

    return $owned->merge($shared);
  }

  public function currentGallery()
  {
    return Gallery::whereId($this->getMeta('current_gallery_id'))->first();
  }

  public function contacts(): HasMany
  {
    return $this->hasMany(Contact::class);
  }
}
