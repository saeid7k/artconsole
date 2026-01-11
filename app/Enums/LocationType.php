<?php

namespace App\Enums;

use Illuminate\Support\Str;

enum LocationType: string
{
  case Internal = 'internal';
  case External = 'external';
  case Venue = 'venue';
  case Contact = 'contact';

  public function label(): string
  {
    return Str::headline($this->value);
  }

  public function color(): string
  {
    return match ($this) {
      self::Internal => 'gray',
      self::External => 'blue',
      self::Venue => 'purple',
      self::Contact => 'green',
    };
  }

  public static function default(): self
  {
    return self::Internal;
  }

  public static function stringifyAll(): string
  {
    return implode(',', array_map(fn($case) => $case->value, self::cases()));
  }
}
