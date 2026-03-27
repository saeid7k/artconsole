<?php

namespace App\Policies;

use App\Models\User;

class InvoicePolicy
{
  /**
   * Create a new policy instance.
   */
  public function __construct()
  {
  }

  public function viewAny(User $user): bool
  {
    $gallery = $user->currentGallery();
    return $gallery ? $gallery->isMember($user) : false;
  }

  public function view(User $user, $invoice): bool
  {
    $gallery = $invoice->gallery;
    return $gallery ? $gallery->isMember($user) : false;
  }

  public function store(User $user): bool
  {
    $gallery = $user->currentGallery();
    return $gallery ? $gallery->hasEditAccess($user) : false;
  }

  public function update(User $user, $invoice): bool
  {
    $gallery = $invoice->gallery;
    return $gallery->hasEditAccess($user);
  }

  public function delete(User $user, $invoice): bool
  {
    $gallery = $invoice->gallery;
    return $gallery->hasEditAccess($user);
  }
}
