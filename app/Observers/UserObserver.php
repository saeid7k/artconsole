<?php

namespace App\Observers;

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
    $gallery->members()->attach($user->id, [
      'access' => 'owner',
      'created_at' => now(),
      'updated_at' => now(),
    ]);

    $user->setCurrentGallery($gallery->id);
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
