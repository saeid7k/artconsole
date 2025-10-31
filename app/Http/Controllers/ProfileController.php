<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Media;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
  /**
   * Display the user's profile form.
   */
  public function edit(Request $request): Response
  {
    return Inertia::render('Profile/Edit', [
      'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
      'status' => session('status'),
    ]);
  }

  /**
   * Update the user's profile information.
   */
  public function update(ProfileUpdateRequest $request)
  {
    $user = $request->user();
    $user->fill(Arr::except($request->validated(), ['email']));

    if ($user->isDirty('email')) {
      $user->email_verified_at = null;
    }

    $user->save();

    return response()->json(['message' => 'Profile updated successfully']);
  }

  /**
   * Delete the user's account.
   */
  public function destroy(Request $request): RedirectResponse
  {
    $request->validate([
      'password' => ['required', 'current_password'],
    ]);

    $user = $request->user();

    Auth::logout();

    $user->delete();

    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return Redirect::to('/');
  }

  public function updatePhoto(Request $request)
  {
    $request->validate([
      'photo' => ['required', 'image', 'max:10240'], // max 10MB
    ]);

    $user = $request->user();

    $user->addMediaFromRequest('photo')
      ->toMediaCollection('profile_photo');

    activity()
      ->performedOn($user)
      ->log('updated profile photo');

    // delete previous photos
    $medias = $user->getMedia('profile_photo');
    if ($medias->count() > 1) {
      $medias->sortByDesc('id')->skip(1)->each(function (Media $media) {
        $media->delete();
      });
    }

    return Response()->json(['message' => 'Profile photo updated successfully']);
  }
}
