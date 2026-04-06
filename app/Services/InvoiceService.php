<?php

namespace App\Services;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;

class InvoiceService
{
  public function __construct(protected Invoice $invoice)
  {
  }

  public function autoUpdateStatus()
  {
    $amountPaid = $this->invoice->amount_paid;
    $total = $this->invoice->total;

    // set status based on amount paid
    if ($amountPaid >= $total) {
      $this->invoice->status = InvoiceStatus::Paid->value;
    } elseif ($amountPaid > 0) {
      $this->invoice->status = InvoiceStatus::PartiallyPaid->value;
    } else {
      $this->invoice->status = InvoiceStatus::Draft->value;
    }

    // set to overdue if past due date and not fully paid
    if (
      $this->invoice->due_date &&
      now()->greaterThan($this->invoice->due_date) &&
      $amountPaid < $total
    ) {
      $this->invoice->status = InvoiceStatus::Overdue->value;
    }

    $this->invoice->saveQuietly();
  }
}
