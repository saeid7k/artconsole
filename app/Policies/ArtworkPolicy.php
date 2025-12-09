<?php

namespace App\Policies;

use App\Models\Artwork;
use App\Models\Contact;
use App\Models\User;

class ArtworkPolicy
{
  /**
   * Create a new policy instance.
   */
  public function __construct() {}

  public function create(User $user): bool
  {
    return $this->isEditorOrOwner($user);
  }

  public function view(User $user, Artwork $artwork): bool
  {
    $gallery = $user->currentGallery();
    return $gallery ? $gallery->isMember($user) : false;
  }

  public function delete(User $user, Artwork $artwork): bool
  {
    return $this->isEditorOrOwner($user);
  }

  public function update(User $user, Artwork $artwork): bool
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
