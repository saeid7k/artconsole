<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
  protected $casts = [
    'address' => 'object',
  ];

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
}
