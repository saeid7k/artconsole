<?php

namespace App\Observers;

use App\Enums\InvoiceStatus;

class InvoiceObserver
{
  public function created($invoice)
  {
    if (!$invoice->status) {
      $invoice->status = InvoiceStatus::default()->value;
    }
    if (!$invoice->user_id) {
      $invoice->user_id = auth()->id();
    }
    $invoice->saveQuietly();
  }
}
