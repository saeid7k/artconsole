<?php

namespace App\Jobs;

use App\Mail\NewInvitationMail;
use App\Models\InviteLink;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendInvitationMailJob implements ShouldQueue
{
  use Queueable;

  public $timeout = 60;
  public $tries = 3;

  public function __construct(public int $inviteLinkId)
  {
  }

  public function handle(): void
  {
    $inviteLink = InviteLink::findOrFail($this->inviteLinkId);

    Mail::to($inviteLink->email)->sendNow(new NewInvitationMail($inviteLink));
  }

  public function failed(\Throwable $exception): void
  {
    Log::error('SendInvitationMailJob failed', [
      'invite_link_id' => $this->inviteLinkId,
      'exception' => $exception->getMessage(),
    ]);
  }
}
