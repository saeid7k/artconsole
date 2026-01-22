<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
  public function modelActivities(Request $request) {
    $validated = $request->validate([
      'model_type' => ['required', 'string'],
      'model_id' => ['required', 'integer'],
      'names' => ['sometimes', 'array'],
    ]);

    $model = ucfirst($request->input('model_type'));
    $modelId = $request->input('model_id');

    $activities = Activity::where('subject_type', 'App\\Models\\' . $model)
      ->where('subject_id', $modelId)
      ->where(function ($q) use ($request) {
        if ($request->has('names')) {
          $q->whereIn('log_name', $request->input('names'));
        }
      })
      ->with(['causer' => function ($q) {
        $q->select('id', 'firstname', 'lastname', 'email');
      }])
      ->orderBy('created_at', 'asc')
      ->get();

    return response()->json($activities);
  }
}
