<?php

namespace App\Mail;

use App\Models\Gallery;
use App\Models\Invoice;
use App\Services\InvoiceExportService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SendInvoiceMail extends Mailable implements ShouldQueue
{
  use Queueable, SerializesModels;

  /**
   * Create a new message instance.
   */

  public Gallery $gallery;

  public function __construct(public Invoice $invoice)
  {
    $this->gallery = $invoice->gallery;
  }

  /**
   * Get the message envelope.
   */
  public function envelope(): Envelope
  {
    return new Envelope(
      from: new Address(config('mail.from.address'), $this->invoice->gallery->name),
      subject: $this->invoice->email_subject,
      replyTo: [
        new Address($this->invoice->gallery->email, $this->invoice->gallery->name),
      ],
    );
  }

  /**
   * Get the message content definition.
   */
  public function content(): Content
  {
    return new Content(
      view: 'email.invoice',
    );
  }

  /**
   * Get the attachments for the message.
   *
   * @return array<int, Attachment>
   */
  public function attachments(): array
  {
    return [
      Attachment::fromData(function () {
        $base64Pdf = (new InvoiceExportService($this->invoice))->pdf()->base64();
        return base64_decode($base64Pdf);
      }, 'Invoice - ' . $this->invoice->invoice_number . '.pdf')
        ->withMime('application/pdf'),
    ];
  }
}
