<?php

namespace App\Policies;

use App\Models\Gallery;
use App\Models\Location;
use App\Models\User;

class LocationPolicy
{
  /**
   * Create a new policy instance.
   */
  public function __construct()
  {}

  public function viewAny(User $user): bool
  {
    return true;
  }

  public function update(User $user, Gallery $gallery)
  {
    return $gallery->hasEditAccess($user);
  }
}
