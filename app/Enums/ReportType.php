<?php

namespace App\Enums;

use Illuminate\Support\Str;

enum ReportType: string
{
  case WallLabel = 'wall_label';
  case Inventory = 'inventory';

  public function label(): string
  {
    return Str::headline($this->value);
  }

  public static function default(): self
  {
    return self::WallLabel;
  }

  public static function stringifyAll(): string
  {
    return implode(',', array_map(fn($case) => $case->value, self::cases()));
  }
}
