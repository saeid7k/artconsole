<?php

namespace App\Enums;

use Illuminate\Support\Str;

enum ArtworkStatus: string
{
  case Available = 'available';
  case OnHold = 'on_hold';
  case Sold = 'sold';
  case InTransit = 'in_transit';
  case ConsignedOut = 'consigned_out';

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
      self::InTransit => 'purple',
      self::ConsignedOut => 'teal',
    };
  }

  public static function stringifyAll(): string
  {
    return implode(',', array_map(fn($case) => $case->value, self::cases()));
  }

  public static function values(): array
  {
    return array_map(fn($case) => $case->value, self::cases());
  }

  public static function unSoldValues(): array
  {
    return array_filter(self::values(), fn($value) => $value !== self::Sold->value);
  }
}
