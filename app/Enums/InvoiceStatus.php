<?php

namespace App\Enums;

use Illuminate\Support\Str;

enum InvoiceStatus: string
{
  case Draft = 'draft';
  case Sent = 'sent';
  case PartiallyPaid = 'partially_paid';
  case Paid = 'paid';
  case Overdue = 'overdue';
  case Void = 'void';

  public function label(): string
  {
    return Str::headline($this->value);
  }

  public static function default(): self
  {
    return self::Draft;
  }

  public static function successful(): self
  {
    return self::Paid;
  }

  public static function stringifyAll(): string
  {
    return implode(',', array_map(fn($case) => $case->value, self::cases()));
  }
}
