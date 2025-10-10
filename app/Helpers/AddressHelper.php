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
}
