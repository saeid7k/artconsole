<?php

namespace App\Policies;

use App\Models\Contact;
use App\Models\User;

class ContactPolicy
{
  /**
   * Create a new policy instance.
   */
  public function __construct() {}

  public function delete(User $user, Contact $contact): bool
  {
    return $user->id == $contact->owner()->id;
  }
}
