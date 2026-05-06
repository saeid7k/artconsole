<?php

namespace App\Ai\Agents;

use Laravel\Ai\Concerns\RemembersConversations;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Contracts\HasProviderOptions;
use Laravel\Ai\Enums\Lab;
use Laravel\Ai\Promptable;
use Stringable;

class DescriptionAgent implements Agent, Conversational, HasProviderOptions
{
  use Promptable, RemembersConversations;

  public string $provider;
  public string $model;

  public function __construct()
  {
    $this->provider = config('ai.default');
    $this->model = config('ai.models.description');
  }

  public function providerOptions(Lab|string $provider): array
  {
    return [];
  }

  public function instructions(): Stringable|string
  {
    return "You are an expert art critic and gallery curator with deep knowledge of art history and techniques. "
      . "The user will provide an image of an artwork along with structured metadata and a requested length.\n\n"
      . "Your task is to write a compelling description of the artwork matching the requested length.\n\n"
      . "GUIDELINES:\n"
      . "1. Describe the subject matter and visual composition as seen in the image.\n"
      . "2. Discuss the mediums and techniques employed by the artist.\n"
      . "3. If the artist is well-known or historically significant, include a brief note on their background and the context of this work in their career or artistic movement.\n"
      . "4. Write in a professional yet accessible tone suitable for a gallery or collector context.\n"
      . "5. OUTPUT FORMAT: Return ONLY the description text. Do not include any labels, headers, or markdown formatting.";
  }

  public function tools(): iterable
  {
    return [];
  }
}
