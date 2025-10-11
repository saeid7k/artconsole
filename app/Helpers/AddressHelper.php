<?php

namespace App\Helpers;

class AddressHelper
{
  public static function CANADIAN_PROVINCE_ABBREVIATIONS(): array
  {
    $provincesJson = file_get_contents(resource_path('js/constants/Provinces.json'));
    $provincesData = json_decode($provincesJson, true);
    return array_keys($provincesData['Canada']['provinces']);
  }

  public static function formatPostalCode(string $postalCode): string
  {
    $postalCode = strtoupper(str_replace(' ', '', $postalCode));
    if (strlen($postalCode) === 6) {
      return substr($postalCode, 0, 3) . ' ' . substr($postalCode, 3);
    }
    return $postalCode;
  }
}
