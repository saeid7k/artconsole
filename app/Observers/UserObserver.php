<?php

namespace App\Observers;

use App\Helpers\AddressHelper;
use App\Helpers\ConfigHelper;
use App\Models\User;
use Illuminate\Support\Facades\Http;

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

    // Set User Settings
    if ($user->address) {
      $user->setTimezoneFromAddress();
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
