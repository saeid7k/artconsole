<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DemoForbidden
{
  /**
   * Handle an incoming request.
   *
   * @param  Closure(Request): (Response)  $next
   */
  public function handle(Request $request, Closure $next): Response
  {
    $user = $request->user();
    if ($user && $user->is_demo) {
      return redirect()->route('dashboard')->with('flash', [
        'type' => 'error',
        'error' => 'This action is not allowed in demo mode.'
      ]);
    }

    return $next($request);
  }
}
