<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
  public function modelActivities(Request $request) {
    $model = ucfirst($request->input('model_type'));
    $modelId = $request->input('model_id');

    $activities = Activity::where('subject_type', 'App\\Models\\' . $model)
      ->where('subject_id', $modelId)
      ->with('causer')
      ->orderBy('created_at', 'asc')
      ->get();

    return response()->json($activities);
  }
}
