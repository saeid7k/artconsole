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
    $currentGallery = $user?->currentGallery() ?? null;
    $galleries = $user?->galleries() ?? null;
    $isLoggedAs = session()->has('original_user_id') && session('original_user_id') !== $user?->id;

    return [
      ...parent::share($request),
      'auth' => [
        'user' => $user,
        'is_logged_as' => $isLoggedAs,
      ],
      'current_gallery' => $currentGallery,
      'galleries' => $galleries,
      'flash' => [
        'type' => Session::get('flash.type'),
        'message' => Session::get('flash.message'),
        'error' => Session::get('flash.error'),
      ],
    ];
  }
}
