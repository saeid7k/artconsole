<?php

namespace App\Http\Controllers;

use App\Enums\ArtworkCategory;
use App\Http\Requests\ArtworkStoreUpdateRequest;
use App\Models\Artwork;
use App\Models\Location;
use App\Services\ArtworkService;
use Illuminate\Http\Request;

class ArtworkController extends Controller
{
  public function index(Request $request)
  {
    $this->authorize('viewAny', Artwork::class);

    $user = auth()->user();
    $gallery = $user->currentGallery();
    $artworks = $gallery->artworks()
      ->with([
        'artist:id,firstname,lastname',
        'owner:id,firstname,lastname',
        'location',
      ])
      ->when($request->search, function ($q) use ($request) {
        $search = '%' . strtolower($request->search) . '%';
        $q->where(function ($q) use ($search) {
          $q->whereRaw('LOWER(title) LIKE ?', $search)
            ->orWhereRaw('LOWER(description) LIKE ?', $search)
            ->orWhereRaw('LOWER(notes) LIKE ?', $search)
            ->orWhereRaw('LOWER(sku) LIKE ?', $search);
        });
      })
      ->when($request->category, function ($q) use ($request) {
        $categories = explode(',', $request->category);
        $q->whereIn('category', $categories);
      })
      ->when($request->status, function ($q) use ($request) {
        $statuses = explode(',', $request->status);
        $q->whereIn('status', $statuses);
      })
      ->when($request->location, function ($q) use ($request) {
        $locationIds = explode(',', $request->location);
        $q->whereIn('location_id', $locationIds);
      })
      ->when($request->sort_by && $request->sort_order, function ($q) use ($request) {
        $q->orderBy($request->sort_by, $request->sort_order);
      }, function ($q) {
        $q->orderBy('id', 'desc');
      })
      ->paginate($request->per_page ?? 10)->withQueryString();

    $locations = $gallery->locations()->get(['id', 'name']);

    return inertia('Artworks/Index', [
      'artworks' => $artworks,
      'locations' => $locations,
    ]);
  }

  public function show(Artwork $artwork)
  {
    $this->authorize('view', $artwork);

    $artwork->load(['location', 'owner']);
    $artwork->images = $artwork->getImagesAttribute();

    return inertia('Artworks/Show', [
      'artwork' => $artwork,
    ]);
  }

  public function storeUpdate(ArtworkStoreUpdateRequest $request)
  {

    if ($request->mode == 'create') {
      $this->authorize('create', Artwork::class);
      $user = auth()->user();
      $gallery = $user->currentGallery();
      $artwork = $gallery->artworks()->create($request->all());
      return response()->json([
        'message' => 'Artwork created successfully.',
        'artwork_id' => $artwork->id,
      ]);
    } elseif ($request->mode == 'update') {
      $artwork = Artwork::find($request->artwork_id);
      $this->authorize('update', $artwork);

      $artwork->update($request->all());
      return response()->json([
        'message' => 'Artwork updated successfully.',
        'artwork_id' => $artwork->id,
      ]);
    }
  }

  public function destroy(Artwork $artwork)
  {
    $this->authorize('delete', $artwork);

    $artwork->delete();

    return response()->json([
      'message' => 'Artwork deleted successfully.',
    ]);
  }

  public function generateSku(Request $request)
  {
    $this->authorize('viewAny', Artwork::class);

    $request->validate([
      'artwork' => ['nullable', 'exists:artworks,id'],
      'category' => ['nullable', 'string', 'in:' . ArtworkCategory::stringifyAll()],
    ]);

    $artwork = $request->artwork ? Artwork::find($request->artwork) : null;
    $artworkService = new ArtworkService($artwork);
    $sku = $artworkService->newSku($request->category ?? ($artwork ? $artwork->category : null));

    return response()->json([
      'message' => 'SKU generated successfully.',
      'sku' => $sku,
    ]);
  }

  public function moveLocation(Request $request, Artwork $artwork)
  {
    $this->authorize('update', $artwork);

    $request->validate([
      'location_id' => ['required', 'exists:locations,id'],
      'reason' => ['nullable', 'string', 'max:200'],
    ]);

    $prevLocationId = $artwork->location_id;

    $artwork->location_id = $request->location_id;
    activity()->withoutLogs(function () use ($artwork) {
      $artwork->save();
    });

    activity('artwork-move')
      ->causedBy(auth()->user())
      ->performedOn($artwork)
      ->withProperties([
          'prev_location' => Location::find($prevLocationId)->name ?? null,
          'new_location' => Location::find($request->location_id)->name ?? null,
          'reason' => $request->reason,
        ])
      ->log('moved the artwork to new location');

    return response()->json([
      'message' => 'Artwork moved successfully.',
    ]);
  }

  public function images(Artwork $artwork)
  {
    $this->authorize('view', $artwork);

    $images = $artwork->images->toArray();

    return response()->json([
      'images' => $images,
    ]);
  }

  public function uploadImages(Request $request, Artwork $artwork)
  {
    $this->authorize('update', $artwork);

    $request->validate([
      'files.*' => ['required', 'file', 'mimes:jpeg,png,jpg,gif,svg,webp,heic,heif', 'max:10240'],
    ]);

    if ($request->hasFile('files')) {
      foreach ($request->file('files') as $image) {
        $artwork->addMedia($image)->toMediaCollection('artwork-images');
      }
    }

    return response()->json([
      'message' => 'Images uploaded successfully.',
    ]);
  }

  public function renameImage(Request $request, Artwork $artwork)
  {
    $this->authorize('update', $artwork);

    $request->validate([
      'media_id' => ['required', 'exists:media,id'],
      'new_name' => ['required', 'string', 'max:255'],
    ]);

    $mediaItem = $artwork->getMedia('artwork-images')->where('id', $request->media_id)->first();
    if ($mediaItem) {
      $mediaItem->file_name = $request->new_name;
      $mediaItem->save();
    }

    return response()->json([
      'message' => 'Image renamed successfully.',
    ]);
  }
}
