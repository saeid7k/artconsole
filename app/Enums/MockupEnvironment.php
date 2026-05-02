<?php

namespace App\Enums;

use Illuminate\Support\Str;

enum MockupEnvironment: string
{
  case ArtGallery = 'art_gallery';
  case LivingRoom = 'living_room';
  case Bedroom = 'bedroom';
  case Office = 'office';

  public function label(): string
  {
    return Str::headline($this->value);
  }
}
