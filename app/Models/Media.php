<?php

namespace App\Models;

use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\MediaCollections\Models\Media as BaseMedia;

class Media extends BaseMedia
{
  protected $appends = ['urls'];

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

  public function getUrlsAttribute(): array
  {
    $urls = [
      'original' => $this->getUrl(),
    ];

    foreach ($this->generated_conversions as $name => $isGenerated) {
      if ($isGenerated) {
        $urls[$name] = $this->getUrl($name);
      }
    }

    return $urls;
  }
}
