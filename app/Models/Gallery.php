<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Gallery extends Model
{
  protected $casts = [
    'address' => 'object',
  ];

  // Appends

  protected $appends = [ 'members_count' ];

  public function getMembersCountAttribute()
  {
    return $this->members()->count();
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
      $members->push($owner);
    }

    return $members;
  }

  public function contacts(): HasMany
  {
    return $this->hasMany(Contact::class);
  }
}
