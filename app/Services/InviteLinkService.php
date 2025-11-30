<?php

namespace App\Services;

use App\Models\Gallery;
use App\Models\InviteLink;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class InviteLinkService
{
  public function join(Gallery $gallery, User $user, InviteLink $inviteLink): void
  {
    DB::transaction(function () use ($gallery, $user, $inviteLink) {
      $gallery->members()->attach($user->id, [
        'access' => $inviteLink->settings['access'] ?? 'viewer',
        'created_at' => now(),
        'updated_at' => now(),
      ]);

      $inviteLink->update([
        'registered_at' => now(),
      ]);

      $user->setCurrentGallery($gallery->id);
    });
  }
}
