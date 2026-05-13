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

    return [
      'active_inventory_value' => $gallery->activeInventoryValue(),
      'revenue' => $gallery->revenue(),
    ];
  }
}
