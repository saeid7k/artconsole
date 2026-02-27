<?php

namespace App\Casts;

use Carbon\Carbon;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Contracts\Database\Eloquent\SerializesCastableAttributes;
use Illuminate\Database\Eloquent\Model;

class TimezoneAwareDatetime implements CastsAttributes, SerializesCastableAttributes
{
  protected string $format;

  public function __construct(string $format = 'Y-m-d H:i:s')
  {
    $this->format = $format;
  }

  public function get(Model $model, string $key, mixed $value, array $attributes): ?string
  {
    if (is_null($value)) {
      return null;
    }

    if (!$value instanceof Carbon) {
      $value = Carbon::parse($value);
    }
    
    return $value
      ->setTimezone(auth()->user()->timezone ?? config('app.timezone'))
      ->format($this->format);
  }

  public function set(Model $model, string $key, mixed $value, array $attributes): mixed
  {
    if (is_null($value)) {
      return null;
    }

    if (!$value instanceof Carbon) {
      $value = Carbon::parse($value);
    }

    return $value
      ->shiftTimezone(auth()->user()->timezone ?? config('app.timezone'))
      ->setTimezone(config('app.timezone'))
      ->format('Y-m-d H:i:s');
  }

  public function serialize(Model $model, string $key, mixed $value, array $attributes): ?string
  {
    return $value instanceof Carbon ? $value->format($this->format) : $value;
  }
}
