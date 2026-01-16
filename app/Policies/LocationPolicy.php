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

  public function create(User $user): bool
  {
    return $user->currentGallery()->hasEditAccess($user);
  }

  public function update(User $user, Location $location): bool
  {
    return $location->gallery->hasEditAccess($user);
  }

  public function delete(User $user, Location $location): bool
  {
    return $location->gallery->hasEditAccess($user);
  }
}
