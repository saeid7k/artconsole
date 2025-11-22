<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AppLayoutController extends Controller
{
  public function intervalData(Request $request)
  {
    $user = $request->user();

    $notifications = $user->notifications()->latest()->take(5)->get();

    $data = [
      'unread_notifications_count' => $user->unreadNotifications()->count(),
      'latest_notifications' => $notifications,
    ];

    return response()->json($data);
  }
}
