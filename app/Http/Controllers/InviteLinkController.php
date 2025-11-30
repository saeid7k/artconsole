<?php

namespace App\Http\Controllers;

use App\Models\InviteLink;
use App\Services\InviteLinkService;
use Carbon\Carbon;
use Illuminate\Http\Request;

class InviteLinkController extends Controller
{
  public function delete(Request $request, InviteLink $inviteLink)
  {
    $this->authorize('delete', $inviteLink);

    $inviteLink->delete();

    return response(['message' => 'Invitation deleted successfully.']);
  }

  public function accept(Request $request, InviteLink $inviteLink)
  {
    $this->authorize('accept', $inviteLink);

    $user = $request->user();
    $gallery = $inviteLink->gallery;

    (new InviteLinkService())->join($gallery, $user, $inviteLink);

    return response([
      'message' => 'Joined gallery successfully.',
      'gallery_id' => $gallery->id,
      ]);
  }

  public function decline(Request $request, InviteLink $inviteLink)
  {
    $this->authorize('accept', $inviteLink);

    $inviteLink->delete();

    return response(['message' => 'Invitation declined successfully.']);
  }

  public function joinByToken(Request $request, $token)
  {
    $inviteLink = InviteLink::where('token', $token)->firstOrFail();

    if (!$inviteLink) {
      session(['flash' => [
        'type' => 'error',
        'error' => 'Invalid invitation link.'
      ]]);
      return redirect()->route('dashboard');
    }

    if ($inviteLink->registered_at) {
      session(['flash' => [
        'type' => 'error',
        'error' => 'This invitation link has already been used to register.'
      ]]);
      return redirect()->route('dashboard');
    }

    $expiry = $inviteLink->expires_at ? Carbon::parse($inviteLink->expires_at) : null;
    if ($expiry && $expiry->isPast()) {
      session(['flash' => [
        'type' => 'error',
        'error' => 'This invitation link has expired.'
      ]]);
      return redirect()->route('dashboard');
    }

    $user = $request->user() ?? null;
    $gallery = $inviteLink->gallery;

    if ($user && $user->email === $inviteLink->email) {
      $this->authorize('accept', $inviteLink);
      (new InviteLinkService())->join($gallery, $user, $inviteLink);
      session(['flash' => [
        'type' => 'success',
        'message' => 'You have successfully joined the gallery "' . $gallery->name . '".'
      ]]);
      return redirect()->route('dashboard');
    }

    if (!$user) {
      session(['invite_token' => $token]);
      return redirect()->route('register');
    } else {
      session(['flash' => [
        'type' => 'error',
        'error' => 'You are logged in with a different account. Please log out and use the invitation link again.'
      ]]);
      return redirect()->route('dashboard');
    }
  }
}
