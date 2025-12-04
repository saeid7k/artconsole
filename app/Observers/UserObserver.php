<?php

namespace App\Observers;

use App\Models\Gallery;
use App\Models\User;

class UserObserver
{
  /**
   * Handle the User "created" event.
   */
  public function created(User $user): void
  {
    // create default gallery for user
    $user->galleriesOwned()->create([
      'name' =>  $user->firstname . "'s Gallery",
    ]);
  }

  /**
   * Handle the User "updated" event.
   */
  public function updated(User $user): void
  {
    //
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
