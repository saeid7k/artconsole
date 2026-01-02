<?php

namespace App\Observers;

use App\Models\Artwork;
use App\Services\ArtworkService;

class ArtworkObserver
{
  /**
   * Handle the User "created" event.
   */
  public function created(Artwork $artwork): void
  {
    // set SKU if not set
    if (!$artwork->sku) {
      $artworkService = new ArtworkService($artwork);
      $artwork->sku = $artworkService->newSku($artwork->category);
      $artwork->saveQuietly();
    }
  }

  public function updated(Artwork $artwork): void
  {
    //
  }

  public function deleted(Artwork $artwork): void
  {
    //
  }

  public function restored(Artwork $artwork): void
  {
    //
  }

  public function forceDeleted(Artwork $artwork): void
  {
    //
  }
}
