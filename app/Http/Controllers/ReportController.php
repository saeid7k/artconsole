<?php

namespace App\Http\Controllers;

use App\Enums\ReportType;
use Illuminate\Http\Request;
use Spatie\LaravelPdf\Enums\Format;
use Spatie\LaravelPdf\Enums\Unit;

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

    return redirect()->route('reports.index', $report);
  }

  public function download(Request $request, $reportId)
  {
    $user = auth()->user();
    $gallery = $user->currentGallery();

    $report = $gallery->reports()->findOrFail($reportId);

    switch ($report->type) {
      case 'artworks_label':
        $viewPath = 'reports.artworks-label';
        break;
      case 'inventory_report':
        $viewPath = 'reports.inventory-report';
        break;
    }

    switch ($report->options->size ?? null) {
      case 'small':
        $viewPath = $viewPath . '-small';
        $margins = [0.5, 0.1875, 0.5, 0.1875];
        break;
      case 'medium':
        $viewPath = $viewPath . '-medium';
        $margins = [0.5, 0.25, 0.5, 0.25];
        break;
      case 'large':
        $viewPath = $viewPath . '-large';
        $margins = [0.5, 0.5, 0.5, 0.5];
        break;
      default:
        $viewPath = $viewPath . '-small';
        $margins = [0.5, 0.1875, 0.5, 0.1875];
    }

    if (!isset($viewPath)) {
      return response()->json([
        'message' => 'Invalid report type'
      ], 400);
    }

    $artworks = $gallery->artworks()->whereIn('id', $report->artworks)->get()->toArray() ?? [];

    return pdf()
      ->view($viewPath, ['report' => $report, 'artworks' => [...$artworks, ...$artworks]])
      ->format(Format::Letter)
      ->margins($margins[0], $margins[1], $margins[2], $margins[3], Unit::Inch)
      ->download($report->name . '.pdf');

    abort(404);
  }
}
