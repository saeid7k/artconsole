<?php

namespace App\Traits;

use App\Models\Note;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\Auth;

trait HasNotes
{
  public function notes(): MorphMany
  {
    $user = Auth::user();
    $gallery = $user?->currentGallery();

    return $this->morphMany(Note::class, 'noteable')
      ->when($gallery, function ($q) use ($gallery) {
        $q->where('gallery_id', $gallery?->id);
      });

  }

  public function addNote(string|null $content, ?int $userId = null): Note
  {
    $user = $userId ? User::find($userId) : Auth::user();
    return $this->notes()->create([
      'user_id' => $user?->id,
      'gallery_id' => $user?->currentGallery()->id,
      'content' => $content,
      'collaborators_ids' => [$user?->id],
    ]);
  }

  public function updateNote(int $noteId, string|null $newContent): bool
  {
    $note = $this->notes()->find($noteId);
    $collaborators = array_unique([...$note?->collaborators_ids, Auth::id()]);

    return $note ?
      $note->update([
        'content' => $newContent,
        'collaborators_ids' => $collaborators,
        ])
      :
      false;
  }

  public function deleteNote(int $noteId): bool
  {
    return $this->notes()->where('id', $noteId)->delete();
  }
}
