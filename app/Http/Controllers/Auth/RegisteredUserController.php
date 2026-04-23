<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\InviteLink;
use App\Models\User;
use App\Rules\BlockedEmailDomains;
use App\Services\InviteLinkService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
  /**
   * Display the registration view.
   */
  public function create(): Response
  {
    if (session()->has('invite_token')) {
      $token = session('invite_token');
      $inviteLink = InviteLink::where('token', $token)->active()->first();

      if ($inviteLink) {
        return Inertia::render('Auth/Register', [
          'gallery_invited' => $inviteLink->gallery->name,
          'email' => $inviteLink->email,
        ]);
      }
    }

    return Inertia::render('Auth/Register');
  }

  /**
   * Handle an incoming registration request.
   *
   * @throws \Illuminate\Validation\ValidationException
   */
  public function store(Request $request): RedirectResponse
  {
    $request->validate([
      'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique(User::class), new BlockedEmailDomains()],
      'password' => ['required', 'confirmed', Rules\Password::defaults()],
    ], [
      'email.required' => 'The email field is required.',
      'email.email' => 'Please provide a valid email address.',
      'email.lowercase' => 'The email must be in lowercase.',
      'email.unique' => 'An account with this email address already exists.',
    ]);

    $user = User::create([
      'firstname' => $request->firstname,
      'lastname' => $request->lastname,
      'email' => $request->email,
      'password' => Hash::make($request->password),
    ]);

    if ($request->session()->has('invite_token')) {
      $token = $request->session()->pull('invite_token');
      $inviteLink = InviteLink::where('token', $token)
        ->where('email', $request->email)
        ->active()
        ->first();

      if ($inviteLink) {
        $gallery = $inviteLink->gallery;
        (new InviteLinkService($inviteLink))->join($user);

        if (!$user->hasVerifiedEmail()) {
          $user->markEmailAsVerified();
        }

        $request->session()->flash('flash', [
          'type' => 'success',
          'message' => 'You have successfully joined the gallery "' . $gallery->name . '".'
        ]);
      }
    }

    event(new Registered($user));

    Auth::login($user);

    return redirect(route('verification.notice'));
  }
}
