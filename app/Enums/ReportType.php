<?php

namespace App\Enums;

use Illuminate\Support\Str;

enum ReportType: string
{
  case ArtworksLabel = 'artworks_label';
  case InventoryReport = 'inventory_report';

  public function label(): string
  {
    return Str::headline($this->value);
  }

  public static function default(): self
  {
    return self::ArtworksLabel;
  }

  public static function stringifyAll(): string
  {
    return implode(',', array_map(fn($case) => $case->value, self::cases()));
  }
}
