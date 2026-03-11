<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TaxController extends Controller
{
  public function index(Request $request)
  {
    $gallery = $request->user()->currentGallery();
    $taxes = $gallery->taxes()->get();

    return response()->json($taxes);
  }

  public function store(Request $request)
  {
    $gallery = $request->user()->currentGallery();

    $validatedData = $request->validate([
      'name' => 'required|string|max:255',
      'rate' => 'required|numeric|min:0|max:100',
      'description' => 'nullable|string',
      'default' => 'boolean',
    ]);

    $tax = $gallery->taxes()->create($validatedData);

    return response()->json([
      'message' => 'Tax created successfully',
      'tax' => $tax,
    ], 201);
  }

  public function update(Request $request, $id)
  {
    $gallery = $request->user()->currentGallery();
    $tax = $gallery->taxes()->findOrFail($id);

    $validatedData = $request->validate([
      'name' => 'required|string|max:255',
      'rate' => 'required|numeric|min:0|max:100',
      'description' => 'nullable|string',
      'default' => 'boolean',
    ]);

    $tax->update($validatedData);

    return response()->json([
      'message' => 'Tax updated successfully',
      'tax' => $tax,
    ], 200);
  }

  public function destroy(Request $request, $id)
  {
    $gallery = $request->user()->currentGallery();
    $tax = $gallery->taxes()->findOrFail($id);
    $tax->delete();

    return response()->json([
      'message' => 'Tax deleted successfully',
    ], 204);
  }

  public function setDefault(Request $request, $id)
  {
    $gallery = $request->user()->currentGallery();
    $tax = $gallery->taxes()->findOrFail($id);

    $gallery->taxes()->update(['default' => false]);
    $tax->update(['default' => true]);

    return response()->json([
      'message' => 'Default tax set successfully',
      'tax' => $tax,
    ], 200);
  }
}
