<?php

namespace App\Notifications;

use App\Models\InviteLink;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewInvitation extends Notification
{
  use Queueable;

  /**
   * Create a new notification instance.
   */
  public function __construct(
    public InviteLink $inviteLink
  ) {
    //
  }

  /**
   * Get the notification's delivery channels.
   *
   * @return array<int, string>
   */
  public function via(object $notifiable): array
  {
    return ['database'];
  }

  /**
   * Get the mail representation of the notification.
   */
  public function toMail(object $notifiable) {}

  /**
   * Get the array representation of the notification.
   *
   * @return array<string, mixed>
   */
  public function toArray(object $notifiable): array
  {
    return [
      'message' => 'You have been invited to join "' . $this->inviteLink->gallery->name . '".',
    ];
  }

  public function databaseType(object $notifiable): string
  {
    return 'new-invitation';
  }
}
