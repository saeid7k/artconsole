<?php

namespace App\Services;

use App\Models\Gallery;
use App\Models\InviteLink;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class InviteLinkService
{
  private Gallery $gallery;

  public function __construct(private InviteLink $inviteLink)
  {
    $this->gallery = $inviteLink->gallery;
  }

  public function join(User $user): void
  {
    DB::transaction(function () use ($user) {
      $this->gallery->addMember($user, $this->inviteLink->settings['access'] ?? 'viewer');

      $this->inviteLink->update([
        'registered_at' => now(),
      ]);

      $user->setCurrentGallery($this->gallery->id);
    });
  }
}
