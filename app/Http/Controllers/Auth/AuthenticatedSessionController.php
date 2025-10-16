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
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

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
}
