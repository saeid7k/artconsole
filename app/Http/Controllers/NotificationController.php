<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
  public function index(Request $request)
  {
    $user = $request->user();
    $notifications = $user->notifications()->paginate(10);

    return response()->json($notifications);
  }

  public function getLatest(Request $request, int $count)
  {
    $user = $request->user();
    $notifications = $user->notifications()->latest()->take($count)->get();

    return response()->json($notifications);
  }
}
