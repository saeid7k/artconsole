<?php

namespace App\Http\Controllers;

use App\Enums\ReportType;
use App\Services\ReportService;
use Illuminate\Http\Request;

use function Spatie\LaravelPdf\Support\pdf;

class ReportController extends Controller
{
  public function index()
  {
    $user = auth()->user();
    $gallery = $user->currentGallery();

    $reports = $gallery->reports()->latest()->get();

    return inertia('Reports/Index', [
      'reports' => $reports,
    ]);
  }

  public function store(Request $request)
  {
    $user = auth()->user();
    $gallery = $user->currentGallery();

    $request->validate([
      'type' => 'required|string|in:' . ReportType::stringifyAll(),
      'name' => 'required|string',
      'size' => 'nullable|string',
      'description' => 'nullable|string',
      'options' => 'nullable|array',
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

    (new ReportService($report))->generatePdf();

    return redirect()->route('reports.index');
  }

  public function download(Request $request, $reportId)
  {
    return response()->json([
      'message' => 'Not implemented yet'
    ], 501);
  }
}
