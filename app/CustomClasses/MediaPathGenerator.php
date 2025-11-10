<?php

namespace App\CustomClasses;

use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\MediaLibrary\Support\PathGenerator\PathGenerator;

class MediaPathGenerator implements PathGenerator
{
  // Base path for original files
  public function getPath(Media $media): string
  {
    $modelType = $media->model_type;
    $modelId = $media->model_id ?? $media->getKey();
    $collection = $media->collection_name;

    // Derive a reasonable model name from the stored class name
    $modelName = $modelType ? strtolower(class_basename($modelType)) : 'media';

    switch ($collection) {
      case 'profile-photo':
        $path = "profile-photos/user-{$modelId}/{$media->getKey()}/";
        break;
      default:
        $path = "{$modelName}/{$modelId}/{$media->getKey()}/";
    }

    return $path;
  }

  // Path for conversions (thumbnails, etc.)
  public function getPathForConversions(Media $media): string
  {
    return $this->getPath($media) . 'conversions/';
  }

  // Path for responsive images
  public function getPathForResponsiveImages(Media $media): string
  {
    return $this->getPath($media) . 'responsive/';
  }
}
