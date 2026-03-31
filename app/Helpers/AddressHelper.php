<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AddressHelper
{
  public static function CANADIAN_PROVINCE_ABBREVIATIONS(): array
  {
    $provincesJson = file_get_contents(resource_path('js/constants/provinces.json'));
    $provincesData = json_decode($provincesJson, true);
    return array_keys($provincesData['Canada']['provinces']);
  }

  public static function formatAddress($address, int $lines = 1): string
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
    if ($lines == 2) {
      $formatted .= "\n";
    } else {
      $formatted .= ', ';
    }
    $formatted .= $city ? $city : '';
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
    $apiKey = env('OPENCAGE_API_KEY');

    try {
      $response = Http::get('https://api.opencagedata.com/geocode/v1/json', [
        'q' => $address,
        'key' => $apiKey,
        'limit' => 1,
        'no_annotations' => 0
      ]);

      if ($response->successful()) {
        $data = $response->json();
        if (!empty($data['results'])) {
          $result = $data['results'][0];
          return [
            'lat' => $result['geometry']['lat'] ?? null,
            'lng' => $result['geometry']['lng'] ?? null,
            'postal_code' => $result['components']['postcode'] ?? null,
            'timezone' => $result['annotations']['timezone']['name'] ?? null,
          ];
        }
      } else {
        Log::error('OpenCage API Error: ' . $response->body());
      }
    } catch (\Exception $e) {
      Log::error('Geocoding exception: ' . $e->getMessage());
    }

    return null;
  }
}
