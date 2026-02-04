<?php

namespace App\Traits;

use App\Models\Note;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\Auth;

trait HasNotes
{
  public function notes(): MorphMany
  {
    return $this->morphMany(Note::class, 'noteable');
  }

  public function addNote(string|null $content, ?int $userId = null): Note
  {
    return $this->notes()->create([
      'content' => $content,
      'user_id' => $userId ?? Auth::id(),
    ]);
  }

  public function updateNote(int $noteId, string $newContent): bool
  {
    $note = $this->notes()->find($noteId);
    return $note ? $note->update(['content' => $newContent]) : false;
  }

  public function deleteNote(int $noteId): bool
  {
    return $this->notes()->where('id', $noteId)->delete();
  }
}
