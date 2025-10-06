<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
  /**
   * The root template that is loaded on the first page visit.
   *
   * @var string
   */
  protected $rootView = 'app';

  /**
   * Determine the current asset version.
   */
  public function version(Request $request): ?string
  {
    return parent::version($request);
  }

  /**
   * Define the props that are shared by default.
   *
   * @return array<string, mixed>
   */
  public function share(Request $request): array
  {
    $user = $request->user();
    $gallery = $user?->currentGallery() ?? null;

    return [
      ...parent::share($request),
      'auth' => [
        'user' => $user,
      ],
      'gallery' => $gallery,
      'flash' => [
        'type' => Session::get('flash.type'),
        'message' => Session::get('flash.message'),
      ],
    ];
  }
}
