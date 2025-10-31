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

  public function view(User $user, Contact $contact): bool
  {
    $gallery = $contact->gallery;
    return $gallery ? $gallery->isMember($user) : false;
  }

  public function delete(User $user, Contact $contact): bool
  {
    return $this->isEditorOrOwner($user, $contact);
  }

  public function update(User $user, Contact $contact): bool
  {
    return $this->isEditorOrOwner($user, $contact);
  }

  protected function isEditorOrOwner(User $user, Contact $contact): bool
  {
    $gallery = $contact->gallery;
    $accessLevel = $gallery ? $gallery->accessLevel($user) : null;
    return in_array($accessLevel, ['owner', 'editor']);
  }
}
