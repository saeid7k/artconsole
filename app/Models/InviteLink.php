<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\AsArrayObject;
use Illuminate\Database\Eloquent\Model;

class InviteLink extends Model
{
  protected $guarded = [];

  protected $casts = [
    'settings' => AsArrayObject::class,
    'expires_at' => 'datetime',
    'registered_at' => 'datetime',
  ];

  // Relationships

  public function gallery()
  {
    return $this->belongsTo(Gallery::class);
  }

  public function creator()
  {
    return $this->belongsTo(User::class, 'user_id');
  }

  // Methods

  public function isActive(): bool
  {
    if ($this->expires_at && Carbon::parse($this->expires_at)->isPast()) {
      return false;
    }
    if ($this->registered_at) {
      return false;
    }
    return true;
  }

  // scopes

  public function scopeActive($query)
  {
    return $query->whereNull('registered_at')
      ->where(function ($q) {
        $q->whereNull('expires_at')
          ->orWhere('expires_at', '>', Carbon::now());
      });
  }
}
