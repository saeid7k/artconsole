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
}
