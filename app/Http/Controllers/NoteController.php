<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;

class NoteController extends Controller
{
  public function getCollaborators(Request $request, Note $note)
  {
    return response()->json([
      'collaborators' => $note->collaborators(),
    ]);
  }

  public function destroy(Request $request, Note $note)
  {
    $note->delete();

    return response()->json([
      'message' => 'Note deleted successfully',
    ]);
  }

  public function recent(Request $request)
  {
    $user = $request->user();
    $gallery = $user->currentGallery();

    $notes = Note::where('gallery_id', $gallery->id)
      ->latest('updated_at')
      ->take(5)
      ->get();

    return response()->json([
      'notes' => $notes,
    ]);
  }
}
