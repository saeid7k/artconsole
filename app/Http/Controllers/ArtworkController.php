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
        'artist:id,firstname,lastname',
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
      ->when($request->sort_by && $request->sort_order, function ($q) use ($request) {
        $q->orderBy($request->sort_by, $request->sort_order);
      }, function ($q) {
        $q->orderBy('id', 'desc');
      })
      ->paginate($request->per_page ?? 10)->withQueryString();

    return inertia('Artworks/Index', [
      'artworks' => $artworks,
    ]);
  }
}
