<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class GalleryController extends Controller
{
  public function setCurrentGallery(Request $request)
  {
    $galleryId = $request->input('gallery_id');
    $request->user()->setMeta('current_gallery_id', $galleryId);

    return response(['message' => 'Current gallery switched successfully.']);
  }
}
