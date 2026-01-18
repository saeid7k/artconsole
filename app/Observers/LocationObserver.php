<?php

namespace App\Observers;

use App\Helpers\AddressHelper;
use App\Helpers\DataHelper;
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

    // Change primary if current primary is deactivated

    if (!$location->is_active && $location->is_primary) {
      $anotherActiveLocation = Location::where('gallery_id', $location->gallery_id)
        ->where('is_active', true)
        ->where('id', '!=', $location->id)
        ->first();
      if ($anotherActiveLocation) {
        $anotherActiveLocation->updateQuietly(['is_primary' => true]);
        $location->updateQuietly(['is_primary' => false]);
      } else {
        $location->updateQuietly(['is_active' => true]);
      }
    }

    // Fill coordinates

    $address = $location->address;
    $coordinates = $address?->coordinates ?? null;
    $coordinatesIsNotFilled = empty($coordinates?->lat) || empty($coordinates?->lng);

    if (($address?->street && $coordinatesIsNotFilled) || $location->wasChanged('address')) {
      $coordinates = AddressHelper::addressToCoordinates($location->formatted_address);
      if ($coordinates) {
        $address = DataHelper::objectToArray($location->address);
        $address['coordinates']['lat'] = $coordinates['lat'];
        $address['coordinates']['lng'] = $coordinates['lng'];
        $location->address = DataHelper::arrayToObject($address);
        $location->saveQuietly();
      }
    }
  }
}
