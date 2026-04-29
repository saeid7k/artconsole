<?php

namespace App\Http\Controllers;

use App\Models\Artwork;
use App\Models\Contact;
use Illuminate\Http\Request;

class AiController extends Controller
{
  public function getResource(Request $request)
  {
    $validated = $request->validate([
      'model_type' => 'required|string',
      'model_id' => 'required|integer',
    ]);

    $modelType = strtolower($validated['model_type']);

    $allowedModels = [
      'artworks' => Artwork::class,
      'contacts' => Contact::class,
    ];

    if (!array_key_exists($modelType, $allowedModels)) {
      return response()->json(['error' => 'Invalid model type'], 400);
    }

    $modelClass = $allowedModels[$modelType];
    $record = $modelClass::find($validated['model_id']);
    if (!$record) {
      return response()->json(['error' => 'Resource not found'], 404);
    }

    $image = match ($modelType) {
      'artworks' => $record->main_image_thumb_url ?? null,
      'contacts' => $record->photo ?? null,
      default => null,
    };

    $name = match ($modelType) {
      'artworks' => $record->title ?? null,
      'contacts' => $record->full_name ?? null,
      default => null,
    };

    return response()->json([
      'name' => $name,
      'image' => $image,
    ]);
  }
}
