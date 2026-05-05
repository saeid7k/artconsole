<?php

namespace App\Ai\Agents;

use Laravel\Ai\Concerns\RemembersConversations;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Promptable;
use Stringable;

class MockupAgent implements Agent, Conversational
{
  use Promptable, RemembersConversations;

  public string $provider;
  public string $model;

  public function __construct()
  {
    $this->provider = config('ai.default_for_images');
    $this->model = config('ai.models.mockup');
  }

  public function options(): array
  {
    if (str_contains($this->model, 'gemini')) {
      return [
        'quality' => 'medium',
        'generationConfig' => [
          'responseMimeType' => 'image/png',
          'imageConfig' => [
            'aspectRatio' => '16:9',
            'imageSize' => '2K',
          ],
        ],
      ];
    }

    return [];
  }

  public function instructions(): Stringable|string
  {
    return "You are a master exhibition designer and high-end interior decorator. "
      . "The user will provide an image of an original artwork alongside environment and optionally real dimensions of artwork.\n\n"
      . "Your task is to generate a photorealistic room mockup featuring the artwork.\n\n"
      . "CRITICAL RULES:\n"
      . "1. Preserve the artwork perfectly. Do not alter its colors, brushstrokes, or details.\n"
      . "2. Expand the single-word environment into a sophisticated, modern, and uncluttered scene that elevates the piece.\n"
      . "3. Scale the artwork proportionally according to the provided real-world physical dimensions (e.g. cm or inches) of the artwork itself—these are NOT the output image dimensions—and hang it prominently on a pristine wall.\n"
      . "4. Apply highly realistic lighting—such as directional gallery spotlights or soft natural window light—complete with accurate physical shadows and depth.\n"
      . "5. OUTPUT FORMAT: Return ONLY the generated image. Do not include any conversational text, explanations, or markdown formatting.";
  }

  public function tools(): iterable
  {
    return [];
  }
}
