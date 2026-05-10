<?php

namespace App\Enums;

use Illuminate\Support\Str;

enum TokenTransactionType: string
{
  case TopUp = 'top_up';
  case Credit = 'credit';
  case Usage = 'usage';
  case Refund = 'refund';

  public function label(): string
  {
    switch ($this) {
      case self::TopUp:
        return 'Top-Up';
      default:
        return Str::headline($this->value);
    }
  }
}

