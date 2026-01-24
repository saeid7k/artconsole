<?php

namespace App\Observers;

use App\Jobs\SetMediaInfo;
use App\Models\Media;

class MediaObserver
{
  public function created(Media $media)
  {
    if (str_contains($media->mime_type, 'image/')) {
      SetMediaInfo::dispatch($media);
    }
  }
}
