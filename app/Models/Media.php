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

    if (in_array($disk, ['s3', 'r2'])) {
      // Temporary signed URL for S3 and R2
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
      if ($isGenerated && $this->hasGeneratedConversion($name)) {
        try {
          $urls[$name] = $this->getUrl($name);
        } catch (\Spatie\MediaLibrary\MediaCollections\Exceptions\InvalidConversion $e) {
          // ignore invalid conversions
        }
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

  public function fileContent(?string $conversionName = ''): string
  {
    $disk = Storage::disk($this->disk);
    $path = $this->getPath($conversionName);

    if (in_array($this->disk, ['s3', 'r2'])) {
      $content = $disk->get($path);
    } else {
      if (!file_exists($path)) {return "";}
      $content = file_get_contents($path);
    }
    return $content;
  }

  public function base64Content(?string $conversionName = ''): string
  {
    $content = $this->fileContent($conversionName);
    $base64 = base64_encode($content);
    return "data:{$this->mime_type};base64,{$base64}";
  }
}
