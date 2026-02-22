<?php

namespace App\Helpers;

class FormatHelper
{
  public static function toFloat(string|null $value): float|null
  {
    if (is_null($value)) {
      return null;
    }

    $cleanedValue = preg_replace('/[^\d.-]/', '', $value);

    return floatval($cleanedValue);
  }

  public static function formatDimensions($dimensions, bool $showDepth = false): string
  {
    if (!$dimensions) {
      return '-';
    }

    $d = (array) $dimensions;

    $width  = $d['width']  ?? 0;
    $height = $d['height'] ?? 0;
    $depth  = $d['depth']  ?? 0;
    $unit   = $d['unit']   ?? '';

    $unitSymbol = match ($unit) {
      'inches' => 'in',
      'cm'     => 'cm',
      default  => '',
    };

    $dimensionString = "{$width} x {$height}";

    if ($showDepth && $depth) {
      $dimensionString .= " x {$depth}";
    }

    $dimensionString .= " {$unitSymbol}";

    return $dimensionString;
  }

  public static function stringifyArray($array): string
  {
    if (is_null($array) || empty($array)) {
      return '-';
    }

    return implode(', ', $array);
  }
}
