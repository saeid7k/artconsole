<?php

namespace App\Console\Commands;

use App\Models\Media;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\Support\PathGenerator\PathGeneratorFactory;

class MoveMediaToR2 extends Command
{
  protected $signature = 'media:move-to-r2';
  protected $description = 'Move all media from the public disk to the r2 disk and update the media records.';

  public function handle()
  {
    $this->info('Starting media transfer from public disk to r2 disk...');

    $mediaItems = Media::where('disk', 'public')->get();
    $total = $mediaItems->count();

    if ($total === 0) {
      $this->info('No media found on the public disk. Nothing to move.');
      return;
    }

    $this->info("Found {$total} media items to move.");
    $bar = $this->output->createProgressBar($total);
    $bar->start();

    foreach ($mediaItems as $media) {
      try {
        $pathGenerator = PathGeneratorFactory::create($media);
        $basePath = rtrim($pathGenerator->getPath($media), '/');
        $allFiles = Storage::disk('public')->allFiles($basePath);

        foreach ($allFiles as $file) {
          $stream = Storage::disk('public')->readStream($file);

          if ($stream !== null) {
            Storage::disk('r2')->writeStream($file, $stream);
            if (is_resource($stream)) {
              fclose($stream);
            }
          }
        }

        $media->update([
          'disk' => 'r2',
          'conversions_disk' => 'r2',
        ]);

        Storage::disk('public')->deleteDirectory($basePath);
      } catch (\Exception $e) {
        $this->error("\nFailed to move media ID {$media->id}: " . $e->getMessage());
      }

      $bar->advance();
    }

    $bar->finish();
    $this->info("\nMedia transfer completed successfully.");
  }
}
