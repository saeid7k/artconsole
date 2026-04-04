<?php

namespace App\Helpers;

class ConfigHelper
{
    public static function getDefault(string $key)
    {
      $configsFile = file_get_contents(resource_path('/js/constants/configs.json'));
      $configsData = json_decode($configsFile, true);
      return $configsData['defaults'][$key] ?? null;
    }

    public static function getBusinessInfo()
    {
      $businessInfoFile = file_get_contents(resource_path('/js/constants/business_info.json'));
      return json_decode($businessInfoFile, true);
    }
}
