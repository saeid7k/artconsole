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

    return inertia('Locations/Index', [
      'locations' => $locations,
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
