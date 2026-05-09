<?php

namespace App\Jobs;

use App\Ai\Agents\MockupAgent;
use App\Helpers\ConfigHelper;
use App\Models\AgentConversationMessage;
use App\Models\Media;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Ai\Files\Image as AiImage;
use Laravel\Ai\Image;

class GenerateMockup implements ShouldQueue
{
  use Queueable;

  public $timeout = 120;

  public function __construct(
    public string $userId,
    public string $conversationId,
    public int $mediaId,
    public string $environment
  ) {
  }

  public function handle(): void
  {
    $media = Media::findOrFail($this->mediaId);
    $artwork = $media->model;

    $agent = new MockupAgent();
    $userPrompt = "Environment: {$this->environment}";
    if ($artwork->dimensions) {
      $userPrompt .= "\nDimensions of Artwork: {$artwork->formatted_dimensions}";
    }
    $fullPrompt = (string) $agent->instructions() . "\n\n" . $userPrompt;

    AgentConversationMessage::create([
      'id' => Str::uuid()->toString(),
      'conversation_id' => $this->conversationId,
      'user_id' => $this->userId,
      'agent' => MockupAgent::class,
      'role' => 'user',
      'content' => $userPrompt,
      'attachments' => [
          [
            'type' => 'image',
            'media_id' => $this->mediaId,
          ]
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
    $response = Image::of($fullPrompt)
      ->attachments([AiImage::fromBase64($imageData, $media->mime_type)])
      ->size('4:3')
      ->quality('medium')
      ->generate($agent->provider, $agent->model);

    $generatedImage = $response->images->first();
    $imageContent = $generatedImage->content();
    $mimeType = $generatedImage->mime ?? 'image/png';
    $extension = match ($mimeType) {
      'image/jpeg', 'image/jpg' => 'jpg',
      'image/webp' => 'webp',
      default => 'png',
    };

    $generatedMedia = $artwork->addMediaFromString($imageContent)
      ->usingFileName("Mockup-" . Str::slug($artwork->title) . ".{$extension}")
      ->withProperties(['mime_type' => $mimeType])
      ->withCustomProperties([
          'ai_generated' => true,
          'conversation_id' => $this->conversationId,
        ])
      ->toMediaCollection('mockups');

    $responseMeta = [
      'artwork_id' => $artwork->id,
      ...($response ? $response->meta?->toArray() ?? [] : []),
    ];

    $responseMessage = AgentConversationMessage::create([
      'id' => Str::uuid()->toString(),
      'conversation_id' => $this->conversationId,
      'user_id' => $this->userId,
      'agent' => MockupAgent::class,
      'role' => 'assistant',
      'content' => $generatedMedia ? 'Mockup generated successfully.' : 'Failed to generate mockup.',
      'attachments' => [
        [
          'type' => 'image',
          'media_id' => $generatedMedia?->id ?? null,
          'artwork_id' => $artwork->id,
        ],
      ],
      'tool_calls' => [],
      'tool_results' => [],
      'usage' => $response ? $response?->usage?->toArray() ?? [] : [],
      'meta' => $responseMeta,
    ]);
  }

  public function failed(\Throwable $exception): void
  {
    $user = User::find($this->userId);
    if ($user) {
      $user->tokenTransactions()->create([
        'type' => 'refund',
        'amount' => ConfigHelper::tokenUsage('mockup'),
        'description' => 'Refund for failed mockup generation',
      ]);
    }

    Log::error('Mockup generation job failed', [
      'conversation_id' => $this->conversationId,
      'error' => $exception->getMessage(),
    ]);
  }
}
