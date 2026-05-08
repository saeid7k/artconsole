<?php

namespace App\Jobs;

use App\Models\Gallery;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class FreeMonthlyTokens implements ShouldQueue
{
  use Queueable;

  /**
   * Create a new job instance.
   */
  public function __construct()
  {
    //
  }

  /**
   * Execute the job.
   */
  public function handle(): void
  {
    $proGalleries = Gallery::whereHas('subscriptions', function ($query) {
      $query->active();
    })->get();

    $proUsersIds = $proGalleries->pluck('user_id')->unique();

    foreach ($proUsersIds as $userId) {
      $user = User::find($userId);
      if ($user) {
        $user->tokenTransactions()->create([
          'type' => 'credit',
          'amount' => 100,
          'description' => 'Monthly free tokens for Pro subscription',
        ]);
      }
    }
  }
}
