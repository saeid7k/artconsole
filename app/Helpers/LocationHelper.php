<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class LocationHelper
{
  public static function getLocationFromIp(string $ip): ?array
  {
    if (!self::isPublicIp($ip)) {
      return null;
    }

    try {
      $data = Cache::get("location_data_{$ip}");
      
      if (!$data) {
        $response = Http::timeout(5)->get("http://ip-api.com/json/{$ip}", [
            'fields' => 'status,countryCode,timezone',
          ]);

        if ($response->successful()) {
          $data = $response->json();
          Cache::put("location_data_{$ip}", $data, now()->addMonth());
        }
      }

      if (($data['status'] ?? '') === 'success') {
        return [
          'countryCode' => $data['countryCode'] ?? null,
          'timezone'    => $data['timezone'] ?? null,
        ];
      }
    } catch (\Exception $e) {
      Log::warning('IP geolocation failed for IP ' . $ip . ': ' . $e->getMessage());
    }

    return null;
  }

  public static function getCurrencyByCountryCode(string $countryCode): ?string
  {
    return self::$countryCurrencyMap[strtoupper($countryCode)] ?? null;
  }

  private static function isPublicIp(string $ip): bool
  {
    return (bool) filter_var(
      $ip,
      FILTER_VALIDATE_IP,
      FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE
    );
  }

  private static array $countryCurrencyMap = [
    // North America
    'US' => 'USD',
    'CA' => 'CAD',
    // Europe - Eurozone
    'AT' => 'EUR',
    'BE' => 'EUR',
    'CY' => 'EUR',
    'DE' => 'EUR',
    'EE' => 'EUR',
    'ES' => 'EUR',
    'FI' => 'EUR',
    'FR' => 'EUR',
    'GR' => 'EUR',
    'HR' => 'EUR',
    'IE' => 'EUR',
    'IT' => 'EUR',
    'LT' => 'EUR',
    'LU' => 'EUR',
    'LV' => 'EUR',
    'MC' => 'EUR',
    'ME' => 'EUR',
    'MT' => 'EUR',
    'NL' => 'EUR',
    'PT' => 'EUR',
    'SI' => 'EUR',
    'SK' => 'EUR',
    'SM' => 'EUR',
    'VA' => 'EUR',
    'XK' => 'EUR',
    // United Kingdom
    'GB' => 'GBP',
    // Oceania
    'AU' => 'AUD',
    'NZ' => 'NZD',
    // Asia
    'JP' => 'JPY',
    'CN' => 'CNY',
    // Switzerland & Liechtenstein
    'CH' => 'CHF',
    'LI' => 'CHF',
  ];
}
