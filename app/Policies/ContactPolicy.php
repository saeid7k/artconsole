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

  public function create(User $user): bool
  {
    return $this->isEditorOrOwner($user);
  }

  public function view(User $user, Contact $contact): bool
  {
    $gallery = $user->currentGallery();
    return $gallery ? $gallery->isMember($user) : false;
  }

  public function viewAny(User $user): bool
  {
    $gallery = $user->currentGallery();
    return $gallery ? $gallery->isMember($user) : false;
  }

  public function delete(User $user, Contact $contact): bool
  {
    return $this->isEditorOrOwner($user);
  }

  public function update(User $user, Contact $contact): bool
  {
    return $this->isEditorOrOwner($user);
  }

  protected function isEditorOrOwner(User $user): bool
  {
    $gallery = $user->currentGallery();
    $accessLevel = $gallery ? $gallery->accessLevel($user) : null;
    return in_array($accessLevel, ['owner', 'editor']);
  }
}
