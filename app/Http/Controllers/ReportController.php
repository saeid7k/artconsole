<?php

namespace App\Http\Controllers;

use App\Enums\ReportType;
use App\Models\Report;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ReportController extends Controller
{
  public function index(Request $request)
  {
    $user = auth()->user();
    $gallery = $user->currentGallery();

    $reports = $gallery->reports()
      ->latest()
      ->paginate($request->per_page ?? 10)->withQueryString();

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
    $report = Report::findOrFail($reportId);
    $media = $report->media()->first();

    if (!$media) {
      return response()->json([
        'message' => 'Report file not found.',
      ], 404);
    }

    return Storage::disk($media->disk)->download(
      $media->getPathRelativeToRoot(),
      $media->file_name,
      ['Content-Type' => $media->mime_type]
    );
  }

  public function getUrl(Request $request, $reportId)
  {
    $report = Report::findOrFail($reportId);
    $media = $report->media()->first();

    if (!$media) {
      return response()->json([
        'message' => 'Report file not found.',
      ], 404);
    }

    return response()->json([
      'url' => $media->getUrl(),
    ]);
  }

  public function destroy(Request $request, $reportId)
  {
    $report = Report::findOrFail($reportId);
    $report->delete();

    return response()->json([
      'message' => 'Report deleted successfully.',
    ], 200);
  }
}
