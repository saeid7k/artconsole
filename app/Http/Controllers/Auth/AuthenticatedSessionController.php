<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
      $payloads = [
        'canResetPassword' => Route::has('password.request'),
        'status' => session('status'),
      ];

      if (config('app.env') === 'local') {
        $payloads['default_values'] = [
          'email' => config('app.admin_email', ''),
          'password' => '12345678'
        ];
      }

      return Inertia::render('Auth/Login', $payloads);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        if (config('app.env') === 'local' && $request->email === config('app.admin_email')) {
          $user = User::where('email', config('app.admin_email'))->first();
          if ($user) {
            Auth::login($user);
          }
        } else {
          $request->authenticate();
        }

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }

    public function loginAs(User $user)
    {
      if (!session()->has('original_user_id')) {
        session(['original_user_id' => auth()->id()]);
      }

      auth()->login($user);

      return redirect()->route('dashboard')->with('flash', [
        'type' => 'success',
        'message' => 'Logged in as ' . $user->full_name
      ]);
    }

    public function logoutAs()
    {
      $originalUserId = session('original_user_id');
      if ($originalUserId) {
        auth()->loginUsingId($originalUserId);
        session()->forget('original_user_id');
      }

      return redirect()->route('users.index')->with('flash', [
        'type' => 'success',
        'message' => 'Logged back in as ' . auth()->user()->full_name
      ]);
    }

    public function demoLogin()
    {
      $user = User::where('is_demo', true)->where('demo_claimed_at', null)->first();

      if (!$user) {
        return redirect()->route('register')->with('flash', [
          'type' => 'error',
          'message' => 'Demo user is not available. Please register for a new account.'
        ]);
      }

      auth()->login($user);
      $user->updateQuietly(['demo_claimed_at' => now()]);

      return redirect()->route('dashboard')->with('flash', [
        'type' => 'success',
        'message' => 'Logged in as demo user'
      ]);
    }
}
