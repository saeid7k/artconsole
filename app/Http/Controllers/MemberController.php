<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class MemberController extends Controller
{
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
      'access' => 'required|string|in:viewer,editor',
      'message' => 'nullable|string|max:1000',
    ]);

    $existingInvitation = $gallery->invitations()
      ->where('email', $request->input('email'))
      ->active()
      ->first();

    if ($existingInvitation) {
      return response([
        'message' => 'An active invitation already exists for this email address.',
      ], 422);
    }

    $existingMember = $gallery->members()
      ->where('email', $request->input('email'))
      ->first();

    if ($existingMember) {
      return response([
        'message' => 'This email address is already a member of the gallery.',
      ], 422);
    }

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

  public function changeAccessLevel(Request $request, Gallery $gallery)
  {
    $this->authorize('update', $gallery);

    $request->validate([
      'member_id' => 'required|integer|exists:users,id',
      'access' => 'required|string|in:viewer,editor',
    ]);

    if ($request->member_id == $gallery->user_id) {
      return response([
        'message' => 'Cannot change access level of the gallery creator.',
      ], 422);
    }

    if ($request->member_id == $request->user()->id) {
      return response([
        'message' => 'Cannot change your own access level.',
      ], 422);
    }

    $member = $gallery->members()->where('users.id', $request->member_id)->first();

    if (!$member) {
      return response([
        'message' => 'Member not found in the gallery.',
      ], 404);
    }

    $gallery->members()->updateExistingPivot($request->member_id, [
      'access' => $request->input('access'),
    ]);

    return response([
      'message' => 'Member access level updated successfully.',
    ]);
  }

  public function removeMember(Request $request, Gallery $gallery, $memberId)
  {
    $this->authorize('update', $gallery);

    if ($memberId == $gallery->user_id) {
      return response([
        'message' => 'Cannot remove the gallery creator from members.',
      ], 422);
    }

    if ($memberId == $request->user()->id) {
      return response([
        'message' => 'Cannot remove yourself from members.',
      ], 422);
    }

    $member = $gallery->members()->where('users.id', $memberId)->first();

    if (!$member) {
      return response([
        'message' => 'Member not found in the gallery.',
      ], 404);
    }

    $gallery->members()->detach($memberId);

    if ($member->getMeta('current_gallery_id') == $gallery->id) {
      $member->setCurrentGallery();
    }

    return response([
      'message' => 'Member removed successfully.',
    ]);
  }
}
