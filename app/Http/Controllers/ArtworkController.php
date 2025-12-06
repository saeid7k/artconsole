<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ArtworkController extends Controller
{
  public function index(Request $request)
  {
    $user = auth()->user();
    $gallery = $user->currentGallery();
    $artworks = $gallery->artworks()
      ->with([
        'artist' => function ($q) {
          $q->select('id', 'firstname', 'lastname');
        },
      ])
      ->paginate($request->per_page ?? 10)->withQueryString();

    return inertia('Artworks/Index', [
      'artworks' => $artworks,
    ]);
  }
}
