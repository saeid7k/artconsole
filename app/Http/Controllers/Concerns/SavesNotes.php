<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

trait SavesNotes
{
  /**
   * @param \Illuminate\Database\Eloquent\Model&\App\Traits\HasNotes $model
   */
  protected function performSaveNote(Request $request, $model): JsonResponse
  {
    $request->validate([
      'note_id' => ['required'],
      'content' => ['nullable', 'string', 'max:1000'],
    ]);

    if (Str::startsWith($request->note_id, 'new')) {
      $note = $model->addNote($request->content);
      return response()->json([
        'message' => 'Note added successfully.',
        'note_id' => $note->id,
      ]);
    } else {
      $updated = $model->updateNote($request->note_id, $request->content);
      if ($updated) {
        return response()->json([
          'message' => 'Note updated successfully.',
          'note_id' => $request->note_id,
        ]);
      } else {
        return response()->json([
          'message' => 'Note not found.',
        ], 404);
      }
    }
  }
}
