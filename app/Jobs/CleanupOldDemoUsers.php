<?php

namespace App\Jobs;

use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Spatie\Activitylog\Models\Activity;

class CleanupOldDemoUsers implements ShouldQueue
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
    $allDemoUsers = User::where('is_demo', true)
      ->orderBy('created_at', 'asc')
      ->get();
    $claimedDemoUsers = User::where('is_demo', true)
      ->whereNotNull('demo_claimed_at')
      ->orderBy('demo_claimed_at', 'asc')
      ->get();

    if ($allDemoUsers->count() <= 5) {
      return;
    }

    $usersToDelete = $claimedDemoUsers->filter(function ($user) {
      return $user->demo_claimed_at->addWeek()->isPast();
    });

    $remainingCount = $allDemoUsers->count() - $usersToDelete->count();
    if ($remainingCount < 5) {
      $limit = $allDemoUsers->count() - 5;
      $usersToDelete = $usersToDelete->take($limit);
    }

    $deleteMedia = function ($media) {
      $path = app(\Spatie\MediaLibrary\Support\PathGenerator\PathGenerator::class)->getPath($media);
      Storage::disk($media->disk)->deleteDirectory($path);
      $media->forceDelete();
    };

    foreach ($usersToDelete as $user) {
      $user->media->each($deleteMedia);

      foreach ($user->contacts as $contact) {
        $contact->media->each($deleteMedia);
        $contact->forceDelete();
      }

      $user->notes()->delete();

      foreach ($user->invoices as $invoice) {
        $invoice->items()->delete();
        $invoice->payments()->delete();
        $invoice->forceDelete();
      }

      $user->payments()->delete();
      $user->tokenTransactions()->delete();
      $user->invitations()->delete();

      foreach ($user->conversations as $conversation) {
        foreach ($conversation->messages as $message) {
          $message->media->each($deleteMedia);
          $message->delete();
        }
        $conversation->delete();
      }

      DB::table('gallery_user')->where('user_id', $user->id)->delete();
      Activity::causedBy($user)->delete();
      Activity::forSubject($user)->delete();
      $user->notifications()->delete();
      DB::table('password_reset_tokens')->where('email', $user->email)->delete();
      DB::table('sessions')->where('user_id', $user->id)->delete();
      $user->meta()->delete();

      foreach ($user->galleriesOwned as $gallery) {

        foreach ($gallery->artworks as $artwork) {
          $artwork->media->each($deleteMedia);
          $artwork->forceDelete();
        }

        foreach ($gallery->contacts as $contact) {
          $contact->media->each($deleteMedia);
          $contact->forceDelete();
        }

        foreach ($gallery->reports as $report) {
          $report->media->each($deleteMedia);
          $report->delete();
        }

        $gallery->locations()->delete();
        $gallery->tags()->delete();
        $gallery->taxes()->delete();
        $gallery->invitations()->delete();
        $gallery->meta()->delete();
        $gallery->media->each($deleteMedia);

        $gallery->forceDelete();
      }

      $user->forceDelete();
    }
  }
}
