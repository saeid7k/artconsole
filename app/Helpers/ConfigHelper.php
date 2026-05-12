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

    public static function getAppInfo()
    {
      $configsFile = file_get_contents(resource_path('/js/constants/configs.json'));
      $configsData = json_decode($configsFile, true);
      return $configsData['app'] ?? null;
    }

    public static function tokenUsage(string $key): int
    {
      $configsFile = file_get_contents(resource_path('/js/constants/configs.json'));
      $configsData = json_decode($configsFile, true);
      return (int) ($configsData['ai']['token_usage'][$key] ?? 0);
    }

    public static function tokens(string $key)
    {
      $configsFile = file_get_contents(resource_path('/js/constants/configs.json'));
      $configsData = json_decode($configsFile, true);
      return $configsData['token'][$key] ?? null;
    }
}
