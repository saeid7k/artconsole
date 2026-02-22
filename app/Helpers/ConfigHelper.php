<?php

namespace App\Helpers;

class ConfigHelper
{
    public static function getDefault(string $key)
    {
      $configsFile = file_get_contents(resource_path('configs.json'));
      $configsData = json_decode($configsFile, true);
      return $configsData['defaults'][$key] ?? null;
    }
}
