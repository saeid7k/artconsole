<?php

namespace App\Enums;

use Illuminate\Support\Str;

enum ArtworkStatus: string
{
  case Available = 'available';
  case Sold = 'sold';
  case OnLoan = 'on_loan';

  public function label(): string
  {
    return Str::headline($this->value);
  }

  public function color(): string
  {
    return match ($this) {
      self::Available => 'green',
      self::Sold => 'red',
      self::OnLoan => 'blue'
    };
  }
}
