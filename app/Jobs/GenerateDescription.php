<?php

namespace App\Jobs;

use App\Ai\Agents\DescriptionAgent;
use App\Models\AgentConversationMessage;
use App\Models\Media;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Ai\Files\Image as AiImage;

class GenerateDescription implements ShouldQueue
{
  use Queueable;

  public $timeout = 120;

  public function __construct(
    public string $userId,
    public string $conversationId,
    public int $mediaId
  ) {
  }

  public function handle(): void
  {
    $media = Media::findOrFail($this->mediaId);
    $artwork = $media->model;

    $agent = new DescriptionAgent();
    $userPrompt = "Artwork Metadata:\n" . json_encode($artwork->brief, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

    AgentConversationMessage::create([
      'id' => Str::uuid()->toString(),
      'conversation_id' => $this->conversationId,
      'user_id' => $this->userId,
      'agent' => DescriptionAgent::class,
      'role' => 'user',
      'content' => $userPrompt,
      'attachments' => [
        [
          'type' => 'image',
          'media_id' => $this->mediaId,
        ],
      ],
      'tool_calls' => [],
      'tool_results' => [],
      'usage' => [],
      'meta' => [
        'artwork_id' => $artwork->id,
      ],
    ]);

    $base64Image = $media->base64Content();
    [, $imageData] = explode(',', $base64Image, 2);

    $response = null;
    try {
      $response = $agent->prompt(
        $userPrompt,
        [AiImage::fromBase64($imageData, $media->mime_type)],
        $agent->provider,
        $agent->model,
      );
    } catch (\Throwable $th) {
      Log::error('Description generation failed', [
        'conversation_id' => $this->conversationId,
        'error' => $th->getMessage(),
      ]);
    }

    $responseMeta = [
      'artwork_id' => $artwork->id,
      ...($response ? $response->meta?->toArray() ?? [] : []),
    ];

    AgentConversationMessage::create([
      'id' => Str::uuid()->toString(),
      'conversation_id' => $this->conversationId,
      'user_id' => $this->userId,
      'agent' => DescriptionAgent::class,
      'role' => 'assistant',
      'content' => $response ? $response->text : 'Failed to generate description.',
      'attachments' => [],
      'tool_calls' => [],
      'tool_results' => [],
      'usage' => $response ? $response->usage?->toArray() ?? [] : [],
      'meta' => $responseMeta,
    ]);
  }
}
