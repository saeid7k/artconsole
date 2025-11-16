<?php

namespace App\Http\Controllers;

use App\Models\InviteLink;
use Illuminate\Http\Request;

class InviteLinkController extends Controller
{
  public function delete(Request $request, InviteLink $inviteLink)
  {
    $this->authorize('delete', $inviteLink);

    $inviteLink->delete();

    return response(['message' => 'Invitation deleted successfully.']);
  }
}
