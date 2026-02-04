<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;

class NoteController extends Controller
{
  public function getCollaborators(Request $request, Note $note)
  {
    $collaborators = $note->collaborators()->map(function ($user) {
      return [
        'id' => $user->id,
        'full_name' => $user->full_name,
        'photo' => $user->photo,
      ];
    });

    return response()->json([
      'collaborators' => $collaborators,
    ]);
  }

  public function destroy(Request $request, Note $note)
  {
    $note->delete();

    return response()->json([
      'message' => 'Note deleted successfully',
    ]);
  }
}
