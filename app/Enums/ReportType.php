<?php

namespace App\Enums;

use Illuminate\Support\Str;

enum ReportType: string
{
  case ArtworkLabels = 'artwork_labels';
  case InventoryReport = 'inventory_report';

  public function label(): string
  {
    return Str::headline($this->value);
  }

  public static function default(): self
  {
    return self::ArtworkLabels;
  }

  public static function stringifyAll(): string
  {
    return implode(',', array_map(fn($case) => $case->value, self::cases()));
  }
}
