<?php

namespace App\Services;

use App\Enums\ArtworkStatus;
use App\Enums\ReportType;
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
      case 'inventory':
        $viewPath = 'reports.inventory';
        break;
    }
    $margins = [0.5, 0.1875, 0.5, 0.1875];

    if ($this->report->type === 'artworks_label') {
      switch ($this->report->options->size ?? null) {
        case 'small':
          $viewPath = $viewPath . '-small';
          $margins = [0.5, 0.1875, 0.5, 0.1875];
          break;
        case 'medium':
          $viewPath = $viewPath . '-medium';
          $margins = [0.5, 0.1562, 0.5, 0.1562];
          break;
        case 'large':
          $viewPath = $viewPath . '-large';
          $margins = [0.512, 0.118, 0.512, 0.118];
          break;
        default:
          $viewPath = $viewPath . '-small';
          $margins = [0.5, 0.1875, 0.5, 0.1875];
      }
    }

    if (!isset($viewPath)) {
      return response()->json([
        'message' => 'Invalid report type'
      ], 400);
    }

    $gallery = $this->report->gallery;
    $gallery->base64_logo = $gallery->getLastMedia('gallery-logo')->base64Content() ?? null;
    $artworks = $gallery->artworks()->with('artist')->whereIn('id', $this->report->artworks)->get() ?? [];
    $artworks->map(function ($artwork) use ($gallery) {
      $artwork->formatted_mediums = FormatHelper::stringifyArray($artwork->mediums ?? []);
      $artwork->formatted_dimensions = FormatHelper::formatDimensions($artwork->dimensions, true);
      $artwork->formatted_price = Number::currency(((float) $artwork->price ?? 0), $gallery->currency == 'CAD' ? 'USD' : $gallery->currency, precision: 0);
      $artwork->base64_image = $artwork->mainImage ? $artwork->mainImage->base64Content('thumb') : null;
      $artwork->status = ArtworkStatus::from($artwork->status)->label();
      return $artwork;
    });
    $this->report->type_title = ReportType::from($this->report->type)->label();

    if ($this->report->type == 'inventory') {
      $this->report->type_title = $this->report->type_title . ' Report';
    }

    $tempPath = storage_path('app/report_' . $this->report->id . '.pdf');
    $pdf = pdf()
      ->view($viewPath, ['report' => $this->report, 'artworks' => $artworks])
      ->format(Format::Letter)
      ->margins($margins[0], $margins[1], $margins[2], $margins[3], Unit::Inch)
      ->footerView('reports.footer');

    if ($this->report->options->header ?? false) {
      $pdf
        ->margins(1.25, $margins[1], $margins[2], $margins[3], Unit::Inch)
        ->headerView('reports.header', ['report' => $this->report, 'gallery' => $gallery]);
    }

    $pdf->save($tempPath);

    $this->report->addMedia($tempPath)
      ->usingFileName(Str::slug($this->report->name) . '.pdf')
      ->toMediaCollection('report');
  }
}
