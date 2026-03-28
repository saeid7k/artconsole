<?php

namespace App\Observers;

use App\Services\InvoiceService;

class PaymentObserver
{
  public function saved($payment)
  {
    $invoiceService = new InvoiceService($payment->invoice);
    $invoiceService->autoUpdateStatus();
  }

  public function deleted($payment)
  {
    $invoiceService = new InvoiceService($payment->invoice);
    $invoiceService->autoUpdateStatus();
  }
}
