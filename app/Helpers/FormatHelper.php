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

  public static function formatPhoneNumber($phone, $countryCode = '+1'): string
  {
    if (!$phone) {
      return '-';
    }

    $digits = preg_replace('/\D+/', '', $phone);

    if (strlen($digits) === 10 && $countryCode === '+1') {
      return '('.substr($digits, 0, 3).') '.substr($digits, 3, 3).'-'.substr($digits, 6);
    }

    return $phone;
  }
}
