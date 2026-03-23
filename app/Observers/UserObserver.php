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
    $sampleLogo = Http::get("https://api.dicebear.com/9.x/shapes/svg?seed={$gallery->id}")->body() ?? null;
    if ($sampleLogo) {
      $gallery->addMediaFromString($sampleLogo)->usingFileName('gallery-' . $gallery->id . '-logo.svg')->toMediaCollection('gallery-logo');
    }

    // Set User Settings
    $user->setMeta('timezone', ConfigHelper::getDefault('timezone', config('app.timezone')));
  }

  /**
   * Handle the User "updated" event.
   */
  public function updated(User $user): void
  {
    // update timezone if not set yet

    if ($user->wasChanged('address') && !$user->getMeta('timezone')) {
      $formattedAddress = $user->formatted_address;
      if ($formattedAddress) {
        $geocode = AddressHelper::addressToGeocode($formattedAddress);
        if ($geocode && isset($geocode['timezone'])) {
          $user->setMeta('timezone', $geocode['timezone']);
        }
      }
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
