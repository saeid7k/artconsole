<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Subscribed
{
  /**
   * Handle an incoming request.
   *
   * @param  Closure(Request): (Response)  $next
   */
  public function handle(Request $request, Closure $next): Response
  {
    $user = $request->user();
    $gallery = $user?->currentGallery();

    if (!$gallery->subscribed() && !$user->is_demo) {
      if ($request->wantsJson() || $request->ajax()) {
          abort(402, 'You need to subscribe to access this feature.');
        }
      return redirect()->route('subscription.index');
    }

    return $next($request);
  }
}
