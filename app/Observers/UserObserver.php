<?php

namespace App\Observers;

use App\Helpers\LocationHelper;
use App\Models\User;

class UserObserver
{
  /**
   * Handle the User "created" event.
   */
  public function created(User $user): void
  {
    // create default gallery for user
    $gallery = $user->galleriesOwned()->create([
      'name' =>  $user->firstname . "'s Gallery",
    ]);
    $gallery->setRandomLogo();

    // Set timezone and gallery currency based on address (if present) or IP location
    if ($user->address) {
      $user->setTimezoneFromAddress();
    } else {
      $this->applyLocationFromIp($user, $gallery);
    }
  }

  /**
   * Detect the user's location from their request IP and apply timezone and
   * default gallery currency accordingly.
   */
  private function applyLocationFromIp(User $user, $gallery): void
  {
    $ip = request()->ip();
    if (!$ip) {
      return;
    }

    $locationData = LocationHelper::getLocationFromIp($ip);
    if (!$locationData) {
      return;
    }

    if (!empty($locationData['timezone'])) {
      $user->setMeta('timezone', $locationData['timezone']);
    }

    if (!empty($locationData['countryCode'])) {
      $currency = LocationHelper::getCurrencyByCountryCode($locationData['countryCode']);
      if ($currency) {
        $gallery->currency = $currency;
      }
    }
  }

  /**
   * Handle the User "updated" event.
   */
  public function updated(User $user): void
  {
    // update timezone if not set yet
    if ($user->wasChanged('address') && !$user->getMeta('timezone')) {
      $user->setTimezoneFromAddress();
    }
  }

  /**
   * Handle the User "deleted" event.
   */
  public function deleted(User $user): void
  {
    //
  }

  /**
   * Handle the User "restored" event.
   */
  public function restored(User $user): void
  {
    //
  }

  /**
   * Handle the User "force deleted" event.
   */
  public function forceDeleted(User $user): void
  {
    //
  }
}
