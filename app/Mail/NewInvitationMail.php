<?php

namespace App\Mail;

use App\Models\Gallery;
use App\Models\InviteLink;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class NewInvitationMail extends Mailable
{

  /**
   * Create a new message instance.
   */
  public InviteLink $inviteLink;
  public Gallery $gallery;

  public function __construct(InviteLink $inviteLink)
  {
    $this->inviteLink = $inviteLink;
    $this->gallery = $inviteLink->gallery;
  }

  /**
   * Get the message envelope.
   */
  public function envelope(): Envelope
  {
    return new Envelope(
      from: new Address(config('mail.from.address'), $this->inviteLink->creator?->firstname . ' via ' . config('app.name')),
      subject: 'Invitation from ' . $this->inviteLink->creator?->full_name,
    );
  }

  /**
   * Get the message content definition.
   */
  public function content(): Content
  {
    return new Content(
      view: 'email.new-invitation',
    );
  }

  /**
   * Get the attachments for the message.
   *
   * @return array<int, \Illuminate\Mail\Mailables\Attachment>
   */
  public function attachments(): array
  {
    return [];
  }
}
