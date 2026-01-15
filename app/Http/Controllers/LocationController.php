<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LocationController extends Controller
{
  public function index(Request $request)
  {
    $user = auth()->user();
    $gallery = $user->currentGallery();
    $locations = $gallery->locations()
      ->withCount('artworks')
      ->orderBy('name')
      ->paginate($request->per_page ?? 10)->withQueryString();

    foreach ($locations as $location) {
      $location->artworks_images_urls = $location->artworksImagesUrls('thumb', 10);
    }

    return inertia('Locations/Index', [
      'locations' => $locations,
    ]);
  }

  public function storeUpdate(Request $request)
  {
    $user = auth()->user();
    $gallery = $user->currentGallery();

    $data = $request->validate([
      'id' => ['sometimes', 'integer', 'exists:locations,id'],
      'type' => ['required', 'string', 'in:internal,external,venue,contact'],
      'contact_id' => ['nullable', 'integer', 'exists:contacts,id'],
      'name' => ['required', 'string', 'max:255'],
      'description' => ['nullable', 'string'],
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

  public function options()
  {
    $user = auth()->user();
    $gallery = $user->currentGallery();
    $locations = $gallery->locations()
      ->select('id', 'name', 'is_primary')
      ->active()
      ->orderBy('name')->get();

    return response()->json([
      'locations' => $locations,
      'message' => 'Locations fetched successfully.',
    ]);
  }
}
