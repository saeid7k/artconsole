<?php

namespace App\Http\Controllers;

use App\Models\InviteLink;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

    DB::transaction(function () use ($gallery, $user, $inviteLink) {
      $gallery->members()->attach($user->id, [
        'access' => $inviteLink->settings['access'] ?? 'viewer',
        'created_at' => now(),
        'updated_at' => now(),
      ]);

      $inviteLink->update([
        'registered_at' => now(),
      ]);
    });

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
}
