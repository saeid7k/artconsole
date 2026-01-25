<?php

namespace App\Models;

use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\MediaCollections\Models\Media as BaseMedia;

class Media extends BaseMedia
{
  protected $appends = ['urls', 'is_main', 'dimensions'];

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

  public function getIsMainAttribute(): bool
  {
    return $this->custom_properties['is_main'] ?? false;
  }

  public function getDimensionsAttribute(): string | null
  {
    if (($this->custom_properties['width'] ?? false) && ($this->custom_properties['height'] ?? false)) {
      $result = $this->custom_properties['width'] . ' x ' . $this->custom_properties['height'];
    } else {
      $result = null;
    }
    return $result;
  }
}
