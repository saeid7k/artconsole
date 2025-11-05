<?php

namespace App\Helpers;

use function PHPUnit\Framework\isArray;

class AddressHelper
{
  public static function CANADIAN_PROVINCE_ABBREVIATIONS(): array
  {
    $provincesJson = file_get_contents(resource_path('js/constants/Provinces.json'));
    $provincesData = json_decode($provincesJson, true);
    return array_keys($provincesData['Canada']['provinces']);
  }

  public static function formatAddress($address): string
  {
    if (!$address || empty((array) $address)) {
      return '';
    }

    if (is_array($address)) {
      $address = (object) $address;
    }

    $formatted = $address->unit ? $address->street . ' - ' . $address->unit : $address->street;
    $formatted .= $address->city ? ', ' . $address->city : '';
    $formatted .= $address->province ? ', ' . $address->province : '';
    $formatted .= $address->postal_code ? ' ' . self::formatPostalCode($address->postal_code) : '';
    $formatted .= $address->country ? ', ' . $address->country : '';

    return $formatted;
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
