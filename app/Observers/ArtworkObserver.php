<?php

namespace App\Observers;

use App\Models\Artwork;
use App\Services\ArtworkService;

class ArtworkObserver
{
  public function creating(Artwork $artwork): void
  {
    $user = auth()->user();
    $gallery = $artwork->gallery ?? $user->currentGallery();

    // assign creator if not set
    if (!$artwork->creator_id) {
      $artwork->creator()->associate($user);
    }
    // assign location if not set
    if (!$artwork->location_id) {
      $artwork->location()->associate(
        $gallery->primaryLocation()->first()
      );
    }
  }

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
