<?php

namespace App\Jobs;

use App\Ai\Agents\MockupAgent;
use App\Models\Media;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class GenerateMockup implements ShouldQueue
{
  use Queueable;

  public $timeout = 120;

  public function __construct(
    public string $conversationId,
    public int $userId,
    public int $mediaId,
    public string $environment
  ) {}

  public function handle(): void
  {
    $user = User::findOrFail($this->userId);
    $media = Media::findOrFail($this->mediaId);
    $agent = new MockupAgent();
    $fileUrl = $media->getUrl();

    $prompt = "Environment of the mockup to be '{$this->environment}'.";

    $agent->continue($this->conversationId, as: $user)
      ->prompt($prompt, attachments: [$fileUrl]);
  }
}
