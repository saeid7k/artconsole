<?php

namespace App\Enums;

use Illuminate\Support\Str;

enum ArtworkStatus: string
{
  case Available = 'available';
  case Sold = 'sold';
  case OnLoan = 'on_loan';
  case InTransit = 'in_transit';
  case InExhibition = 'in_exhibition';

  public function label(): string
  {
    return Str::headline($this->value);
  }

  public function color(): string
  {
    return match ($this) {
      self::Available => 'green',
      self::Sold => 'red',
      self::OnLoan => 'blue',
      self::InTransit => 'orange',
      self::InExhibition => 'purple',
    };
  }
}
