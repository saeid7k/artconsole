<?php

namespace App\Http\Controllers;

use App\Enums\ReportType;
use Illuminate\Http\Request;

class ReportController extends Controller
{
  public function index()
  {
    return inertia('Reports/Index');
  }

  public function store(Request $request)
  {
    $user = auth()->user();
    $gallery = $user->currentGallery();

    $request->validate([
      'type' => 'required|string|in:' . ReportType::stringifyAll(),
      'name' => 'required|string',
      'description' => 'nullable|string',
      'options' => 'nullable|object',
      'artworks' => 'nullable|array',
    ]);

    $report = $gallery->reports()->create([
      'user_id' => $user->id,
      'type' => $request->type,
      'name' => $request->name,
      'description' => $request->description ?? null,
      'options' => $request->options ?? null,
      'artworks' => $request->artworks ?? null,
    ]);

    return redirect()->route('reports.index', $report);
  }
}
