<?php

namespace App\Policies;

use App\Models\User;

class PaymentPolicy
{
  public function store(User $user): bool
  {
    $gallery = $user->currentGallery();
    return $gallery ? $gallery->hasEditAccess($user) : false;
  }

  public function delete(User $user, $payment): bool
  {
    $gallery = $payment->gallery;
    return $gallery ? $gallery->hasEditAccess($user) : false;
  }
}
