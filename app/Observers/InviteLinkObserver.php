<?php

namespace App\Observers;

use App\Jobs\SendInvitationMailJob;
use App\Models\InviteLink;
use App\Models\User;
use App\Notifications\NewInvitation;

class InviteLinkObserver
{
    /**
     * Handle the InviteLink "created" event.
     */
    public function created(InviteLink $inviteLink): void
    {
      $inviteLink->creator()->associate(auth()->user());
      $inviteLink->saveQuietly();

      $userInvited = User::where('email', $inviteLink->email)->verified()->first();
      if ($userInvited) {
        $userInvited->notify(new NewInvitation($inviteLink));
      } else {
        // Send email invitation
        SendInvitationMailJob::dispatch($inviteLink->id);
      }
    }

    /**
     * Handle the InviteLink "updated" event.
     */
    public function updated(InviteLink $inviteLink): void
    {
        //
    }

    /**
     * Handle the InviteLink "deleted" event.
     */
    public function deleted(InviteLink $inviteLink): void
    {
        //
    }

    /**
     * Handle the InviteLink "restored" event.
     */
    public function restored(InviteLink $inviteLink): void
    {
        //
    }

    /**
     * Handle the InviteLink "force deleted" event.
     */
    public function forceDeleted(InviteLink $inviteLink): void
    {
        //
    }
}
