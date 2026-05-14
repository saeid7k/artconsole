<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
  public function index(Request $request)
  {
    $user = $request->user();

    return Inertia::render('Dashboard');
  }

  public function kpiData(Request $request)
  {
    $user = $request->user();
    $gallery = $user->currentGallery();

    $totalRevenue = $gallery->revenue();
    $revenueCurrentPeriod = $gallery->revenue(dateFrom: now()->subDays(30)->toDateString());
    $revenuePreviousPeriod = $gallery->revenue(dateFrom: now()->subDays(60)->toDateString(), dateTo: now()->subDays(31)->toDateString());
    $revenueTrend = $revenuePreviousPeriod > 0 ? round(($revenueCurrentPeriod - $revenuePreviousPeriod) / $revenuePreviousPeriod * 100, 0) : null;
    $pendingInvoicesCount = $gallery->pendingInvoicesCount();
    $pendingInvoicesAmount = $gallery->pendingInvoicesAmount();
    $saleCount = $gallery->saleCount();

    return [
      'active_inventory_value' => $gallery->activeInventoryValue(),
      'revenue' => $totalRevenue,
      'revenue_trend' => $revenueTrend,
      'pending_invoices_count' => $pendingInvoicesCount,
      'pending_invoices_amount' => $pendingInvoicesAmount,
      'sale_count' => $saleCount,
    ];
  }
}
