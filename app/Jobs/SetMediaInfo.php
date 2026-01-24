<?php

namespace App\Jobs;

use App\Models\Media;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class SetMediaInfo implements ShouldQueue
{
  use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

  public $media;

  public function __construct(Media $media)
  {
    $this->media = $media;
  }

  public function handle(): void
  {
    try {
      $path = $this->getImagePath($this->media);
      $dimensions = getimagesize($path);

      if ($dimensions) {
        $this->media->setCustomProperty('width', $dimensions[0]);
        $this->media->setCustomProperty('height', $dimensions[1]);
        $this->media->saveQuietly();
      }
    } catch (\Throwable $th) {
    }
  }

  protected function getImagePath($media)
  {
    if ($media->disk === 's3') {
      return Storage::disk('s3')->temporaryUrl(
        $media->getPath(),
        now()->addMinutes(5)
      );
    }
    return $media->getPath();
  }
}
