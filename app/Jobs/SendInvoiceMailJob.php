<?php

namespace App\Jobs;

use App\Mail\SendInvoiceMail;
use App\Models\Invoice;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendInvoiceMailJob implements ShouldQueue
{
  use Queueable;

  public $timeout = 120;
  public $tries = 3;

  public function __construct(public int $invoiceId)
  {
  }

  public function handle(): void
  {
    $invoice = Invoice::findOrFail($this->invoiceId);

    Mail::to($invoice->contact->email)->sendNow(new SendInvoiceMail($invoice));
  }

  public function failed(\Throwable $exception): void
  {
    Log::error('SendInvoiceMailJob failed', [
      'invoice_id' => $this->invoiceId,
      'exception' => $exception->getMessage(),
    ]);
  }
}
