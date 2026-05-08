<?php

namespace App\Observers;

use App\Models\TokenTransaction;

class TokenTransactionObserver
{
  public function created(TokenTransaction $trx): void
  {
    $user = $trx->user;
    if ($trx->type === 'usage') {
      $user->decreaseTokens($trx->amount);
    } else {
      $user->increaseTokens($trx->amount);
    }
  }
}
