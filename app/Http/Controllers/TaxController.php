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
      'abbreviation' => 'nullable|string|max:50',
      'rate' => 'required|numeric|min:0|max:100',
      'description' => 'nullable|string',
      'tax_number' => 'nullable|string|max:100',
      'default' => 'boolean',
    ]);

    $tax = $gallery->taxes()->create($validatedData);

    return response()->json($tax, 201);
  }

  public function update(Request $request, $id)
  {
    $gallery = $request->user()->currentGallery();
    $tax = $gallery->taxes()->findOrFail($id);

    $validatedData = $request->validate([
      'name' => 'required|string|max:255',
      'abbreviation' => 'nullable|string|max:50',
      'rate' => 'required|numeric|min:0|max:100',
      'description' => 'nullable|string',
      'tax_number' => 'nullable|string|max:100',
      'default' => 'boolean',
    ]);

    $tax->update($validatedData);

    return response()->json($tax);
  }

  public function destroy(Request $request, $id)
  {
    $gallery = $request->user()->currentGallery();
    $tax = $gallery->taxes()->findOrFail($id);
    $tax->delete();

    return response()->json(null, 204);
  }
}
