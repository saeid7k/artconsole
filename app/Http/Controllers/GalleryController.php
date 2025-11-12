<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use App\Models\Media;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
  public function setCurrentGallery(Request $request)
  {
    $galleryId = $request->input('gallery_id');
    $request->user()->setMeta('current_gallery_id', $galleryId);

    return response(['message' => 'Current gallery switched successfully.']);
  }

  public function updateGalleryLogo(Request $request, Gallery $gallery)
  {
    $this->authorize('update', $gallery);

    $request->validate([
      'logo' => 'required|image|max:10240', // max 10MB
    ]);

    $media = $gallery->addMediaFromRequest('logo')
      ->toMediaCollection('gallery-logo');

    activity()
      ->performedOn($gallery)
      ->log('updated gallery logo');

    // delete previous photos
    $medias = $gallery->getMedia('gallery-logo');
    if ($medias->count() > 1) {
      $medias->sortByDesc('id')->skip(1)->each(function (Media $media) {
        $media->delete();
      });
    }

    return response([
      'message' => 'Gallery logo updated successfully.',
      'url' => $media->getUrl(),
    ]);
  }

  public function update(Request $request, Gallery $gallery)
  {
    $this->authorize('update', $gallery);

    $request->validate([
      'name' => 'required|string|max:255',
      'about' => 'string|max:1000',
      'website' => 'string|max:255',
      'email' => 'email|max:255',
    ]);

    $gallery->update($request->all());

    activity()
      ->performedOn($gallery)
      ->log('updated gallery details');

    return response(['message' => 'Gallery details updated successfully.']);
  }

  public function removeLogo(Request $request, Gallery $gallery)
  {
    $this->authorize('update', $gallery);

    $medias = $gallery->getMedia('gallery-logo');
    foreach ($medias as $media) {
      $media->delete();
    }

    activity()
      ->performedOn($gallery)
      ->log('removed gallery logo');

    return response(['message' => 'Gallery logo removed successfully.']);
  }
}
