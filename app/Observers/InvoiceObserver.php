<?php

namespace App\Observers;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;

class InvoiceObserver
{
  public function creating($invoice)
  {
    if (!$invoice->status) {
      $invoice->status = InvoiceStatus::default()->value;
    }
    if (!$invoice->user_id) {
      $invoice->user_id = auth()->id();
    }
    if (!$invoice->number) {
      $invoice->number = Invoice::nextInvoiceNumber($invoice->gallery);
    }
  }
}
