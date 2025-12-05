<?php

namespace App\Enums;

use Illuminate\Support\Str;

enum ArtworkCategory: string
{
  case Painting = 'painting';
  case Sculpture = 'sculpture';
  case Photography = 'photography';

  public function label(): string
  {
    return Str::headline($this->value);
  }

  public function color(): string
  {
    return match ($this) {
      self::Painting => 'blue',
      self::Sculpture => 'gold',
      self::Photography => 'cyan'
    };
  }

  public function code(): string
  {
    return match ($this) {
      self::Painting => 'PNT',
      self::Sculpture => 'SCL',
      self::Photography => 'PHT'
    };
  }
}
