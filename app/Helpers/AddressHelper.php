<?php

namespace App\Helpers;

use function PHPUnit\Framework\isArray;

class AddressHelper
{
  public static function CANADIAN_PROVINCE_ABBREVIATIONS(): array
  {
    $provincesJson = file_get_contents(resource_path('js/constants/provinces.json'));
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

    $unit = property_exists($address, 'unit') ? $address->unit : null;
    $street = property_exists($address, 'street') ? $address->street : null;
    $city = property_exists($address, 'city') ? $address->city : null;
    $province = property_exists($address, 'province') ? $address->province : null;
    $postal_code = property_exists($address, 'postal_code') ? $address->postal_code : null;
    $country = property_exists($address, 'country') ? $address->country : null;

    $formatted = $unit ? $street . ' - ' . $unit : $street;
    $formatted .= $city ? ', ' . $city : '';
    $formatted .= $province ? ', ' . $province : '';
    $formatted .= $postal_code ? ' ' . self::formatPostalCode($postal_code) : '';
    $formatted .= $country ? ', ' . $country : '';

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

  public static function addressToGeocode(string $address): ?array
  {
    $geocoder = app('geocoder')->geocode($address)->get();

    if ($geocoder->isEmpty()) {
      return null;
    }
    $coordinates = $geocoder->first()->getCoordinates();
    $postalCode = $geocoder->first()->getPostalCode();
    $timezone = $geocoder->first()->getTimezone();

    return [
      'lat' => $coordinates->getLatitude(),
      'lng' => $coordinates->getLongitude(),
      'postal_code' => $postalCode,
      'timezone' => $timezone,
    ];
  }
}
