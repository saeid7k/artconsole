<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Rules\Phone;
use Illuminate\Http\Request;

class LocationController extends Controller
{
  public function index(Request $request)
  {
    $this->authorize('viewAny', Location::class);

    $user = auth()->user();
    $gallery = $user->currentGallery();
    $locations = $gallery->locations()
      ->withCount('artworks')
      ->orderBy('name')
      ->paginate($request->per_page ?? 10)->withQueryString();

    foreach ($locations as $location) {
      $location->artworks_images_urls = $location->artworksImagesUrls('small', 10);
      $location->artworks_ids = $location->artworks()->pluck('id');
    }

    return inertia('Locations/Index', [
      'locations' => $locations,
    ]);
  }

  public function storeUpdate(Request $request)
  {
    $user = auth()->user();
    $gallery = $user->currentGallery();

    if ($request->has('id')) {
      $location = Location::findOrFail($request->id);
      $this->authorize('update', $location);
    } else {
      $this->authorize('create', Location::class);
    }

    $data = $request->validate([
      'id' => ['sometimes', 'integer', 'exists:locations,id'],
      'type' => ['required', 'string', 'in:internal,external,venue,contact'],
      'contact_id' => ['nullable', 'integer', 'exists:contacts,id'],
      'name' => ['required', 'string', 'max:255'],
      'description' => ['nullable', 'string'],
      'phone' => ['nullable', new Phone()],
      'email' => ['nullable', 'string', 'max:255', 'email'],
      'address' => ['nullable', 'array'],
      'address_same_as_gallery' => ['required', 'boolean'],
      'is_primary' => ['required', 'boolean'],
      // 'is_active' => ['required', 'boolean'],
    ]);

    $location = $gallery->locations()->updateOrCreate(
      ['id' => $request->id],
      $data
    );

    return response()->json([
      'location' => $location,
      'message' => 'Location saved successfully.',
    ]);
  }

  public function destroy(Request $request, Location $location)
  {
    $this->authorize('delete', $location);

    if ($location->artworks()->count() > 0) {
      return response()->json([
        'message' => 'Cannot delete location with associated artworks.',
      ], 403);
    }

    $location->delete();

    return response()->json([
      'message' => 'Location deleted successfully.',
    ]);
  }

  public function options()
  {
    $this->authorize('viewAny', Location::class);

    $user = auth()->user();
    $gallery = $user->currentGallery();
    $locations = $gallery->locations()
      ->select('id', 'name', 'is_primary')
      ->active()
      ->orderBy('name')->get();

    return response()->json($locations);
  }

  public function setPrimary(Request $request)
  {
    $validated = $request->validate([
      'location_id' => ['required', 'integer', 'exists:locations,id'],
    ]);

    $location = Location::find($validated['location_id']);
    $gallery = $location->gallery;

    $this->authorize('update', $location);

    // Unset previous primary location
    $gallery->locations()->where('is_primary', true)->update(['is_primary' => false]);

    // Set new primary location
    $location->is_primary = true;
    $location->save();

    return response()->json([
      'message' => 'Primary location updated successfully.',
    ]);
  }

  public function toggleActive(Request $request)
  {
    $validated = $request->validate([
      'location_id' => ['required', 'integer', 'exists:locations,id'],
    ]);

    $location = Location::find($validated['location_id']);

    $this->authorize('update', $location);

    if ($location->is_active && $location->isTheOnlyActiveLocation()) {
      return response()->json([
        'message' => 'Cannot deactivate the only active location of the gallery.',
      ], 403);
    }

    $location->is_active = !$location->is_active;
    $location->save();

    return response()->json([
      'location' => $location,
      'message' => 'Location ' . ($location->is_active ? 'activated' : 'deactivated') . ' successfully.',
    ]);
  }
}
