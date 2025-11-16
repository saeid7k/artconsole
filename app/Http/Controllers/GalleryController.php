<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

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

  public function getMembers(Gallery $gallery)
  {
    $this->authorize('view', $gallery);

    $members = $gallery->members()->get();
    $invitations = $gallery->invitations()->active()->get();

    return response([
      'members' => $members,
      'invitations' => $invitations,
    ]);
  }

  public function addMember(Request $request, Gallery $gallery)
  {
    $this->authorize('update', $gallery);

    $request->validate([
      'email' => 'required|email|max:255',
      'access' => 'required|string|in:viewer,editor,owner',
      'message' => 'nullable|string|max:1000',
    ]);

    $inviteLink = $gallery->invitations()->create([
      'email' => $request->input('email'),
      'token' => Str::uuid(),
      'settings' => [
        'access' => $request->input('access'),
        'message' => $request->input('message'),
      ],
      'expires_at' => null,
    ]);

    return response([
      'message' => 'Invitation sent successfully.',
      'entry' => $inviteLink,
    ]);
  }
}
