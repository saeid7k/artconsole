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

  public function markAsRead(Request $request, $notificationId)
  {
    $user = $request->user();
    $notification = $user->notifications()->where('id', $notificationId)->first();

    if ($notification) {
      $notification->markAsRead();
      return response()->json(['message' => 'Notification marked as read.'], 200);
    }

    return response()->json(['message' => 'Notification not found.'], 404);
  }

  public function markAllAsRead(Request $request)
  {
    $user = $request->user();
    $user->unreadNotifications->markAsRead();

    return response()->json(['message' => 'All notifications marked as read.'], 200);
  }
}
