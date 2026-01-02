<?php

namespace App\Enums;

use Illuminate\Support\Str;

enum ArtworkCategory: string
{
  case Painting = 'painting';
  case Sculpture = 'sculpture';
  case Photography = 'photography';
  case DigitalArt = 'digital_art';
  case MixedMedia = 'mixed_media';

  public function label(): string
  {
    return Str::headline($this->value);
  }

  public function color(): string
  {
    return match ($this) {
      self::Painting => 'blue',
      self::Sculpture => 'gold',
      self::Photography => 'cyan',
      self::DigitalArt => 'purple',
      self::MixedMedia => 'green',
    };
  }

  public function code(): string
  {
    return match ($this) {
      self::Painting => 'PNT',
      self::Sculpture => 'SCL',
      self::Photography => 'PHT',
      self::DigitalArt => 'DGT',
      self::MixedMedia => 'MMD',
    };
  }

  public static function default(): self
  {
    return self::Painting;
  }

  public static function stringifyAll(): string
  {
    return implode(',', array_map(fn($case) => $case->value, self::cases()));
  }
}
