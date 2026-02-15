<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use App\Models\Media;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
  public function create(Request $request)
  {
    $this->authorize('create', Gallery::class);

    $request->validate([
      'logo' => 'nullable|image|max:10240',
      'name' => 'required|string|max:255',
      'about' => 'nullable|string|max:1000',
      'website' => 'nullable|string|max:255',
      'email' => 'nullable|email|max:255',
    ]);

    $user = $request->user();

    $gallery = Gallery::create([
      'user_id' => $user->id,
      'name' => $request->input('name'),
      'about' => $request->input('about'),
      'website' => $request->input('website'),
      'email' => $request->input('email'),
    ]);

    $gallery->addMediaFromRequest('logo')
      ->toMediaCollection('gallery-logo');

    return response([
      'message' => 'Gallery created successfully.',
      'gallery_id' => $gallery->id,
    ]);
  }

  public function setCurrentGallery(Request $request)
  {
    $galleryId = $request->input('gallery_id');
    $request->user()->setCurrentGallery($galleryId);

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
      'about' => 'nullable|string|max:1000',
      'website' => 'nullable|string|max:255',
      'email' => 'nullable|email|max:255',
    ]);

    $gallery->update($request->all());

    return response(['message' => 'Gallery details updated successfully.']);
  }

  public function updateAddress(Request $request, Gallery $gallery)
  {
    $this->authorize('update', $gallery);

    $request->validate([
      'address.unit' => ['nullable', 'string', 'max:255'],
      'address.street' => ['nullable', 'string', 'max:255'],
      'address.city' => ['nullable', 'string', 'max:255'],
      'address.province' => ['nullable', 'string', 'max:255'],
      'address.postal_code' => ['nullable', 'string', 'max:20'],
      'address.country' => ['nullable', 'string', 'max:50'],
    ]);

    $gallery->update($request->all());

    return response(['message' => 'Gallery address updated successfully.']);
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

  public function getArtistsOptions(Request $request)
  {
    $user = $request->user();
    $gallery = $user->currentGallery();

    $this->authorize('view', $gallery);

    $artists = $gallery->artists;

    return response(
      $artists->map(function ($artist) {
        return [
          'label' => $artist->firstname . ' ' . $artist->lastname,
          'value' => $artist->id,
        ];
      }),
    );
  }

  public function updateAccounting(Request $request, Gallery $gallery)
  {
    $this->authorize('update', $gallery);

    $request->validate([
      'currency' => ['nullable', 'string', 'max:10'],
    ]);

    $gallery->setMeta('currency', $request->input('currency'));

    return response(['message' => 'Gallery accounting info updated successfully.']);
  }
}
