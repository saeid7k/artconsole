<?php

namespace App\Observers;

use App\Models\Location;

class LocationObserver
{
  public function saved(Location $location)
  {
    // Clear address if same as gallery
    if ($location->address_same_as_gallery) {
      $location->address = null;
      $location->saveQuietly();
    }

    // Ensure only one primary location per gallery
    if ($location->is_primary) {
      Location::where('gallery_id', $location->gallery_id)
        ->where('id', '!=', $location->id)
        ->where('is_primary', true)
        ->update(['is_primary' => false]);
    } else {
      $hasPrimary = Location::where('gallery_id', $location->gallery_id)
        ->where('is_primary', true)
        ->exists();
      if (!$hasPrimary) {
        $firstLocation = Location::where('gallery_id', $location->gallery_id)
          ->where('is_active', true)
          ->first();
        if ($firstLocation) {
          $firstLocation->is_primary = true;
          $firstLocation->saveQuietly();
        }
      }
    }
  }
}
