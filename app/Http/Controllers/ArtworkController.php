<?php

namespace App\Http\Controllers;

use App\Enums\ArtworkCategory;
use App\Http\Requests\ArtworkStoreUpdateRequest;
use App\Models\Artwork;
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
    ]);

    $artwork->location_id = $request->location_id;
    $artwork->save();

    return response()->json([
      'message' => 'Artwork moved successfully.',
    ]);
  }
}
