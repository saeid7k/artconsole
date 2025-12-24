<?php

namespace App\Enums;

use Illuminate\Support\Str;

enum ArtworkStatus: string
{
  case Available = 'available';
  case OnHold = 'on_hold';
  case Sold = 'sold';
  case ConsignedOut = 'consigned_out';
  case OnLoan = 'on_loan';
  case InTransit = 'in_transit';

  public function label(): string
  {
    return Str::headline($this->value);
  }

  public function color(): string
  {
    return match ($this) {
      self::Available => 'green',
      self::OnHold => 'yellow',
      self::Sold => 'red',
      self::ConsignedOut => 'teal',
      self::OnLoan => 'blue',
      self::InTransit => 'purple',
    };
  }
}
