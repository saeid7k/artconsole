<?php

namespace App\Observers;

use App\Helpers\AddressHelper;
use App\Helpers\DataHelper;
use App\Models\Gallery;

class GalleryObserver
{
  /**
   * Handle the Gallery "created" event.
   */
  public function created(Gallery $gallery): void
  {

    // Set Owner and current gallery
    $owner = $gallery->owner;
    $gallery->addMember($owner, 'owner');
    $owner->setCurrentGallery($gallery->id);

    // Create default Location
    $gallery->locations()->create([
      'type' => 'internal',
      'name' => 'Main Location',
      'is_primary' => true,
      'is_active' => true,
    ]);
  }

  /**
   * Handle the Gallery "updated" event.
   */
  public function updated(Gallery $gallery): void
  {
    //
  }

  public function saved(Gallery $gallery): void {

    // Fill coordinates
    $address = $gallery->address;
    $coordinates = $address?->coordinates ?? null;
    $coordinatesIsNotFilled = empty($coordinates?->lat) || empty($coordinates?->lng);

    if (($address?->street && $coordinatesIsNotFilled) || $gallery->wasChanged('address')) {
      $coordinates = AddressHelper::addressToCoordinates($gallery->formatted_address);

      if ($coordinates) {
        $address = DataHelper::objectToArray($gallery->address);
        $address['coordinates']['lat'] = $coordinates['lat'];
        $address['coordinates']['lng'] = $coordinates['lng'];
        $gallery->address = DataHelper::arrayToObject($address);
        $gallery->saveQuietly();
      }
    }
  }

  /**
   * Handle the Gallery "deleted" event.
   */
  public function deleted(Gallery $gallery): void
  {
    //
  }

  /**
   * Handle the Gallery "restored" event.
   */
  public function restored(Gallery $gallery): void
  {
    //
  }

  /**
   * Handle the Gallery "force deleted" event.
   */
  public function forceDeleted(Gallery $gallery): void
  {
    //
  }
}
