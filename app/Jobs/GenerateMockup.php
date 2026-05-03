<?php

namespace App\Jobs;

use App\Ai\Agents\MockupAgent;
use App\Models\AgentConversationMessage;
use App\Models\Media;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Str;
use Laravel\Ai\Files\Image as AiImage;
use Laravel\Ai\Image;

class GenerateMockup implements ShouldQueue
{
  use Queueable;

  public $timeout = 120;

  public function __construct(
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
      $userPrompt .= "\nDimensions: {$artwork->formatted_dimensions}";
    }
    $fullPrompt = (string) $agent->instructions() . "\n\n" . $userPrompt;
    $base64Image = $media->base64Content();
    [, $imageData] = explode(',', $base64Image, 2);
    $options = $agent->options();

    $response = Image::of($fullPrompt)
      ->attachments([AiImage::fromBase64($imageData, $media->mime_type)])
      ->quality($options['quality'] ?? 'low')
      ->generate($agent->provider, $agent->model);

    AgentConversationMessage::create([
      'id' => Str::uuid()->toString(),
      'conversation_id' => $this->conversationId,
      'agent' => MockupAgent::class,
      'role' => 'user',
      'content' => $userPrompt,
      'attachments' => [['type' => 'image', 'media_id' => $this->mediaId]],
      'tool_calls' => [],
      'tool_results' => [],
      'usage' => [],
      'meta' => [],
    ]);

    $generatedImage = $response->firstImage();
    $imageContent = $generatedImage->content();
    $mimeType = $generatedImage->mime ?? 'image/png';
    $extension = match ($mimeType) {
      'image/jpeg', 'image/jpg' => 'jpg',
      'image/webp' => 'webp',
      default => 'png',
    };

    $generatedMedia = $artwork->addMediaFromString($imageContent)
      ->usingFileName("Mockup-{$this->environment}.{$extension}")
      ->withProperties(['mime_type' => $mimeType])
      ->withCustomProperties([
          'ai_generated' => true,
          'conversation_id' => $this->conversationId,
        ])
      ->toMediaCollection('mockups');

    $responseMessage = AgentConversationMessage::create([
      'id' => Str::uuid()->toString(),
      'conversation_id' => $this->conversationId,
      'agent' => MockupAgent::class,
      'role' => 'assistant',
      'content' => '',
      'attachments' => [
        [
          'type' => 'image',
          'media_id' => $generatedMedia->id,
        ],
      ],
      'tool_calls' => [],
      'tool_results' => [],
      'usage' => $response->usage->toArray(),
      'meta' => $response->meta->toArray(),
    ]);
  }
}
