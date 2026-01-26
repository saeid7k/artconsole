<?php

namespace App\Services;

use App\Enums\ArtworkCategory;
use App\Models\Artwork;

class ArtworkService
{
  protected $user;
  protected $gallery;
  protected $artwork;

  public function __construct(?Artwork $artwork = null)
  {
    $this->user = auth()->user();
    $this->artwork = $artwork;
    $this->gallery = $artwork ? $artwork->gallery : $this->user->currentGallery();
  }

  public function newSku(?string $category): string
  {
    $category = $category ?? ($this->artwork ? $this->artwork->category : ArtworkCategory::default()->value);

    $prefix = ArtworkCategory::from($category)->code();
    $year = date('y');

    $latestArtwork = $this->gallery->artworks()->where('sku', 'like', "{$prefix}-{$year}-%")
      ->orderBy('sku', 'desc')
      ->first();

    if ($latestArtwork) {
      $parts = explode('-', $latestArtwork->sku);
      $number = (int) $parts[2] + 1;
    } else {
      $number = 1;
    }

    return sprintf("%s-%s-%03d", $prefix, $year, $number);
  }

  public function setMainImage(int $mediaId): void
  {
    // Unset previous main image
    $this->artwork->media()->where('collection_name', 'artwork-images')
      ->where('custom_properties->is_main', true)
      ->get()
      ->each(function ($media) {
        $media->setCustomProperty('is_main', false);
        $media->saveQuietly();
      });

    // Set new main image
    $media = $this->artwork->media()->where('id', $mediaId)->first();
    if ($media) {
      $media->setCustomProperty('is_main', true);
      $media->saveQuietly();
    }
  }
}
