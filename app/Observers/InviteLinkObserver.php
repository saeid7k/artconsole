<?php

namespace App\Observers;

use App\Models\InviteLink;

class InviteLinkObserver
{
    /**
     * Handle the InviteLink "created" event.
     */
    public function created(InviteLink $inviteLink): void
    {
      $inviteLink->creator()->associate(auth()->user());
      $inviteLink->saveQuietly();
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
