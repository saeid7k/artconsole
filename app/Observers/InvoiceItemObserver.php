<?php

namespace App\Observers;

class InvoiceItemObserver
{
  public function created($invoiceItem)
  {
    $artwork = $invoiceItem->artwork;
    if ($artwork && $invoiceItem->invoice->gallery->getMeta('auto_change_status_sold')) {

      activity()->disableLogging();
      $artwork->update(['status' => 'sold']);
      activity()->enableLogging();

      activity()
        ->performedOn($artwork)
        ->log('marked artwork as sold due to being added to an invoice');
    }
  }
}
