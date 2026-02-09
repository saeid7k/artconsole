<?php

namespace App\Observers;

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
    $sampleLogo = Http::get("https://api.dicebear.com/9.x/shapes/svg?seed={$gallery->id}")->body() ?? null;
    if ($sampleLogo) {
      $gallery->addMediaFromString($sampleLogo)->usingFileName('gallery-' . $gallery->id . '-logo.svg')->toMediaCollection('gallery-logo');
    }
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
