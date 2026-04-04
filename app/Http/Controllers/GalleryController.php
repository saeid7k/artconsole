<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use App\Models\Media;
use App\Rules\Phone;
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
      'country_code' => 'nullable|string|max:10',
      'phone' => ['nullable', new Phone()],
      'website' => 'nullable|string|max:100',
      'email' => 'nullable|email|max:100',
    ]);

    $user = $request->user();

    $gallery = Gallery::create($request->all() + ['user_id' => $user->id]);

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
      'country_code' => 'nullable|string|max:10',
      'phone' => ['nullable', new Phone()],
      'website' => 'nullable|string|max:100',
      'email' => 'nullable|email|max:100',
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

  public function setMeta(Request $request, Gallery $gallery)
  {
    $this->authorize('update', $gallery);

    $request->validate([
      'key' => ['required', 'string'],
      'value' => ['nullable'],
    ]);

    $gallery->setMeta($request->input('key'), $request->input('value'));

    return Response()->json([
      'message' => $request->input('key') . ' updated successfully'
    ]);
  }
}
