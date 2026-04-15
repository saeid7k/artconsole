<?php

namespace App\Observers;

use Laravel\Cashier\Subscription;

class SubscriptionObserver
{
  public function created(Subscription $subscription): void
  {
    // Fill default payment method for the gallery
    $gallery = $subscription->owner;
    if ($gallery) {
      $gallery->fillDefaultPaymentMethod();
    }
  }
}
