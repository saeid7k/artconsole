<?php

namespace App\Listeners;

use App\Events\DemoUserLoggedIn;
use App\Models\User;
use App\Services\DemoUserService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class CreateNextDemoUser implements ShouldQueue
{
  /**
   * Create the event listener.
   */
  public function __construct()
  {
    //
  }

  /**
   * Handle the event.
   */
  public function handle(DemoUserLoggedIn $event): void
  {
    $latestDemoUser = User::where('is_demo', true)
      ->latest()
      ->first();

    $latestUsernameNumber = $latestDemoUser ? (int) str_replace('demo_', '', $latestDemoUser->username) : 0;

    (new DemoUserService())->createDemoUser($latestUsernameNumber + 1);
  }
}
