<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Socialite;

class GoogleAuthController extends Controller
{
  public function redirectToGoogle()
  {
    return Socialite::driver('google')->redirect();
  }

  public function handleGoogleCallback()
  {
    try {
      $googleUser = Socialite::driver('google')->user();

      $user = User::where('social_auth_id->google', $googleUser->id)->first();

      if (!$user) {
        $user = User::where('email', $googleUser->email)->first();

        if ($user) {
          $socialIds = $user->social_auth_id ?? [];
          $socialIds['google'] = $googleUser->id;
          $user->update(['social_auth_id' => $socialIds]);
        } else {
          $user = User::create([
            'firstname' => $googleUser->user['given_name'] ?? $googleUser->getName(),
            'lastname' => $googleUser->user['family_name'] ?? '',
            'username' => $googleUser->email,
            'email' => $googleUser->email,
            'password' => null,
            'social_auth_id' => ['google' => $googleUser->id],
            'email_verified_at' => now(),
          ]);
          $user->addMediaFromUrl($googleUser->avatar)->toMediaCollection('profile-photo');
        }
      }

      Auth::login($user);

      return redirect()->intended(route('dashboard'));
    } catch (\Exception $e) {
      return redirect()->route('login')->with('flash', [
        'type' => 'error',
        'message' => 'Google authentication failed.'
      ]);
    }
  }
}
