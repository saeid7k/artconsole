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
    return $inviteLink->gallery->isEditorOrOwner($user);
  }
}
