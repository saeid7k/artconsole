<?php

namespace App\Policies;

use App\Models\Artwork;
use App\Models\Contact;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ArtworkPolicy
{
  use HandlesAuthorization;
  /**
   * Create a new policy instance.
   */
  public function __construct() {}

  public function create(User $user): bool
  {
    $gallery = $user->currentGallery();
    return $gallery ? $gallery->hasEditAccess($user) : false;
  }

  public function viewAny(User $user): bool
  {
    $gallery = $user->currentGallery();
    return $gallery ? $gallery->isMember($user) : false;
  }

  public function view(User $user, Artwork $artwork)
  {
    $gallery = $user->currentGallery();

    if (!$gallery || $artwork->gallery_id !== $gallery?->id) {
      return $this->denyWithStatus(403, 'This artwork does not belong to your gallery.');
    }

    return $gallery->isMember($user);
  }

  public function delete(User $user, Artwork $artwork)
  {
    $gallery = $user->currentGallery();

    if (!$gallery || $artwork->gallery_id !== $gallery?->id) {
      return $this->denyWithStatus(403, 'This artwork does not belong to your gallery.');
    }

    return $gallery->hasEditAccess($user);
  }

  public function update(User $user, Artwork $artwork)
  {
    $gallery = $user->currentGallery();

    if (!$gallery || $artwork->gallery_id !== $gallery?->id) {
      return $this->denyWithStatus(403, 'This artwork does not belong to your gallery.');
    }

    return $gallery->hasEditAccess($user);
  }
}
