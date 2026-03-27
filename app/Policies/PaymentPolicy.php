<?php

namespace App\Policies;

use App\Models\User;

class PaymentPolicy
{
  public function create(User $user): bool
  {
    $gallery = $user->currentGallery();
    return $gallery ? $gallery->hasEditAccess($user) : false;
  }
}
