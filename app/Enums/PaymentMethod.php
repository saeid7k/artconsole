<?php

namespace App\Enums;

use Illuminate\Support\Str;

enum PaymentMethod: string
{
  case Check = 'check';
  case Cash = 'cash';
  case CreditCard = 'credit_card';
  case BankTransfer = 'bank_transfer';
  case PayPal = 'paypal';
  case Other = 'other';

  public function label(): string
  {
    return Str::headline($this->value);
  }

  public static function default(): self
  {
    return self::Check;
  }

  public static function stringifyAll(): string
  {
    return implode(',', array_map(fn($case) => $case->value, self::cases()));
  }
}
