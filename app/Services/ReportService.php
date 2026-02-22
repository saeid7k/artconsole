<?php

namespace App\Services;

use App\Helpers\FormatHelper;
use App\Models\Report;
use Illuminate\Support\Number;
use Illuminate\Support\Str;
use Spatie\LaravelPdf\Enums\Format;
use Spatie\LaravelPdf\Enums\Unit;

use function Spatie\LaravelPdf\Support\pdf;

class ReportService
{
  protected $report;

  public function __construct(Report $report)
  {
    $this->report = $report;
  }

  public function generatePdf()
  {
    switch ($this->report->type) {
      case 'artworks_label':
        $viewPath = 'reports.artworks-label';
        break;
      case 'inventory_report':
        $viewPath = 'reports.inventory-report';
        break;
    }

    switch ($this->report->options->size ?? null) {
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

    $gallery = $this->report->gallery;
    $artworks = $gallery->artworks()->with('artist')->whereIn('id', $this->report->artworks)->get() ?? [];
    $artworks->map(function ($artwork) {
      $artwork->formatted_mediums = FormatHelper::stringifyArray($artwork->mediums ?? []);
      $artwork->formatted_dimensions = FormatHelper::formatDimensions($artwork->dimensions, true);
      $artwork->formatted_price = Number::currency(((float) $artwork->price ?? 0), 'CAD');
      return $artwork;
    });

    $tempPath = storage_path('app/report_' . $this->report->id . '.pdf');
    pdf()
      ->view($viewPath, ['report' => $this->report, 'artworks' => $artworks])
      ->format(Format::Letter)
      ->margins($margins[0], $margins[1], $margins[2], $margins[3], Unit::Inch)
      ->footerView('reports.footer')
      ->save($tempPath);

    $this->report->addMedia($tempPath)
      ->usingFileName(Str::slug($this->report->name) . '.pdf')
      ->toMediaCollection('report');
  }
}
