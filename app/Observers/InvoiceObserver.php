<?php

namespace App\Observers;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;

class InvoiceObserver
{
  public function creating($invoice)
  {
    // Set default values for new invoices
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

  public function saved($invoice)
  {
    // Change artwork status to "sold" if invoice is marked as paid and gallery setting is enabled
    if (
      $invoice->wasChanged('status')
      && InvoiceStatus::isSuccessful($invoice->status)
      && $invoice->gallery->getMeta('auto_change_status_sold')
    ) {
      $invoice->artworks()->update(['status' => 'sold']);

      foreach ($invoice->artworks as $artwork) {
        activity()->performedOn($artwork)
          ->causedBy(auth()->user())
          ->withProperties([
            'invoice_id' => $invoice->id,
            'invoice_number' => $invoice->number,
          ])
          ->log('marked sale invoice as paid');
      }
    }
  }
}
