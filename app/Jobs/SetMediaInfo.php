<?php

namespace App\Jobs;

use App\Models\Media;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class SetMediaInfo implements ShouldQueue
{
  use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

  public $tries = 3;

  public function backoff(): array
  {
    return [5, 15];
  }

  public function __construct(public Media $media)
  {
  }

  public function handle(): void
  {
    try {
      if (in_array($this->media->disk, ['s3', 'r2'])) {
        $fileContents = Storage::disk($this->media->disk)->get($this->media->getPath());
        if (!$fileContents) {
          Log::error('Could not read file from storage disk: ' . $this->media->disk . ' for media ID: ' . $this->media->id);
          throw new \Exception('Could not read file from storage disk: ' . $this->media->disk);
        }
        $dimensions = getimagesizefromstring($fileContents);
      } else {
        $dimensions = getimagesize($this->media->getPath());
      }

      if ($dimensions) {
        $this->media->setCustomProperty('width', $dimensions[0]);
        $this->media->setCustomProperty('height', $dimensions[1]);
        $this->media->saveQuietly();
      }
    } catch (\Throwable $th) {
      Log::error('Error in SetMediaInfo job for media ID: ' . $this->media->id, ['error' => $th->getMessage()]);
      throw $th;
    }
  }
}
