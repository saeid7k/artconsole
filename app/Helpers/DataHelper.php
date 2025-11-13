<?php

namespace App\Helpers;

class DataHelper
{
  public static function arrayToObject($array)
  {
    if (!is_array($array)) {
      return $array;
    }

    return (object) array_map(function ($value) {
      return self::arrayToObject($value);
    }, $array);
  }


  public static function objectToArray($object)
  {
    if (is_object($object)) $object = get_object_vars($object);
    if (is_array($object)) return array_map([self::class, 'objectToArray'], $object);
    return $object;
  }
}
