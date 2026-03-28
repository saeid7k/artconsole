<?php

namespace App\Jobs;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SetInvoicesOverdue implements ShouldQueue
{
  use Queueable;

  /**
   * Create a new job instance.
   */
  public function __construct()
  {
    //
  }

  /**
   * Execute the job.
   */
  public function handle(): void
  {
    $invoices = Invoice::notPaid()
      ->whereNotNull('due_date')
      ->where('due_date', '<', today()->toDateString())
      ->get();

    foreach ($invoices as $invoice) {
      if ($invoice->amount_paid < $invoice->total) {
        $invoice->status = InvoiceStatus::Overdue->value;
        $invoice->saveQuietly();
      }
    }
  }
}
