<?php

namespace App\Enums;

enum ArtworkEdition: string
{
  case Unique = 'unique';
  case Limited = 'limited';
  case Open = 'open';

  public function label(): string
  {
    return match ($this) {
      self::Unique => 'Unique Piece',
      self::Limited => 'Limited Edition',
      self::Open => 'Open Edition'
    };
  }

  public function color(): string
  {
    return match ($this) {
      self::Unique => 'gold',
      self::Limited => 'blue',
      self::Open => 'green'
    };
  }

  public static function stringifyAll(): string
  {
    return implode(',', array_map(fn($case) => $case->value, self::cases()));
  }
}
