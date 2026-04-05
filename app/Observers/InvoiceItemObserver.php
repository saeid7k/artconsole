<?php

namespace App\Observers;

class InvoiceItemObserver
{
  public function created($invoiceItem)
  {
    $artwork = $invoiceItem->artwork;
    if ($artwork && $invoiceItem->invoice->gallery->getMeta('auto_change_status_sold')) {
      $artwork->update([
        'status' => 'sold'
      ]);
    }
  }
}
