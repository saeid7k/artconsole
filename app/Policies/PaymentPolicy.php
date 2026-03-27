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
}
