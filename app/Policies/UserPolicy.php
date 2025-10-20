<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
  /**
   * Create a new policy instance.
   */
  public function __construct() {}

  public function viewAny(User $authUser): bool
  {
    return $authUser->is_admin;
  }

  public function delete(User $authUser, User $user): bool
  {
    return $authUser->is_admin;
  }
}
