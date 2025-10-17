<?php

namespace App\Models;

use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\MediaCollections\Models\Media as BaseMedia;

class Media extends BaseMedia
{
  public function getUrl(?string $conversionName = ''): string
  {
    $disk = $this->disk;

    if ($disk === 's3') {
      // Temporary signed URL for S3
      return Storage::disk($disk)->temporaryUrl(
        $this->getPath($conversionName),
        now()->addHours(10)
      );
    }

    // Default for local/public
    return parent::getUrl($conversionName);
  }
}
