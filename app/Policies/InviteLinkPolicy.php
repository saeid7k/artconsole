<?php

namespace App\Policies;

use App\Models\InviteLink;
use App\Models\User;

class InviteLinkPolicy
{
  /**
   * Create a new policy instance.
   */
  public function __construct()
  {
    //
  }

  public function delete(User $user, InviteLink $inviteLink)
  {
    return $inviteLink->gallery->hasEditAccess($user);
  }

  public function accept(User $user, InviteLink $inviteLink)
  {
    if (
      $user->is_admin ||
      $inviteLink->email == $user->email
    ) {
      return true;
    }

    return false;
  }
}
