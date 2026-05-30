<?php

namespace App\Observers;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use App\Services\InvoiceService;

class InvoiceObserver
{
  public function creating(Invoice $invoice)
  {
    // Set default values for new invoices
    if (!$invoice->status) {
      $invoice->status = InvoiceStatus::default()->value;
    }
    if (!$invoice->user_id) {
      $invoice->user_id = auth()->id();
    }
    if (!($invoice->getAttributes()['number'] ?? null)) {
      $invoice->number = Invoice::nextInvoiceNumber($invoice->gallery);
    }
  }

  public function saved(Invoice $invoice)
  {
    $invoiceService = new InvoiceService($invoice);

    if ($invoice->wasChanged('total') || $invoice->wasChanged('due_date')) {
      $invoiceService->autoUpdateStatus();
    }
  }

  public function created(Invoice $invoice)
  {
    activity()
      ->performedOn($invoice->contact)
      ->causedBy($invoice->creator)
      ->withProperties(['invoice_id' => $invoice->id])
      ->log('issued the sales invoice ' . $invoice->invoice_number);
  }
}
