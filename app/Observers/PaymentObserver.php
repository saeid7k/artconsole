<?php

namespace App\Observers;

class PaymentObserver
{
  public function saved($payment)
  {
    $payment->invoice->updatePaymentStatus();
  }

  public function deleted($payment)
  {
    $payment->invoice->updatePaymentStatus();
  }
}
