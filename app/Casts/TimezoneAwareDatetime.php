<?php

namespace App\Casts;

use Carbon\Carbon;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

class TimezoneAwareDatetime implements CastsAttributes
{
  private static ?string $cachedTimezone = null;

  protected function userTimezone(): string
  {
    if (static::$cachedTimezone !== null) {
      return static::$cachedTimezone;
    }

    $user = auth()->user();

    static::$cachedTimezone = ($user ? $user->getMeta('timezone') : null) ?? config('app.timezone');

    return static::$cachedTimezone;
  }

  public function get(Model $model, string $key, mixed $value, array $attributes): ?Carbon
  {
    if (is_null($value)) {
      return null;
    }

    return Carbon::parse($value)->setTimezone($this->userTimezone());
  }

  public function set(Model $model, string $key, mixed $value, array $attributes): mixed
  {
    if (is_null($value)) {
      return null;
    }

    return Carbon::parse($value)->setTimezone('UTC')->format('Y-m-d H:i:s');
  }
}
