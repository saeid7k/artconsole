<?php

namespace App\Enums;

use Illuminate\Support\Str;

enum ContactRelationship: string
{
  case Artist = 'artist';
  case Vendor = 'vendor';
  case Collector = 'collector';
  case Other = 'other';

  public function label(): string
  {
    return Str::headline($this->value);
  }
}
