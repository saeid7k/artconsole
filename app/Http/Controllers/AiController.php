<?php

namespace App\Http\Controllers;

use App\Enums\MockupEnvironment;
use App\Jobs\GenerateMockup;
use App\Models\AgentConversation;
use App\Models\AgentConversationMessage;
use App\Models\Artwork;
use App\Models\Contact;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class AiController extends Controller
{
  public function getResource(Request $request)
  {
    $validated = $request->validate([
      'model_type' => 'required|string',
      'model_id' => 'required|integer',
    ]);

    $modelType = strtolower($validated['model_type']);

    $allowedModels = [
      'artworks' => Artwork::class,
      'contacts' => Contact::class,
    ];

    if (!array_key_exists($modelType, $allowedModels)) {
      return response()->json(['error' => 'Invalid model type'], 400);
    }

    $modelClass = $allowedModels[$modelType];
    $record = $modelClass::find($validated['model_id']);
    if (!$record) {
      return response()->json(['error' => 'Resource not found'], 404);
    }

    $image = match ($modelType) {
      'artworks' => $record->main_image_thumb_url ?? null,
      'contacts' => $record->photo ?? null,
      default => null,
    };

    $name = match ($modelType) {
      'artworks' => $record->title ?? null,
      'contacts' => $record->full_name ?? null,
      default => null,
    };

    return response()->json([
      'name' => $name,
      'image' => $image,
    ]);
  }

  public function generateMockup(Request $request)
  {
    $validated = $request->validate([
      'media_id' => ['required', 'integer', Rule::exists('media', 'id')],
      'environment' => ['required', Rule::enum(MockupEnvironment::class)],
    ]);

    $user = $request->user();
    $media = Media::where('id', $validated['media_id'])
      ->firstOrFail();

    $conversationId = Str::uuid()->toString();
    AgentConversation::create([
      'id' => $conversationId,
      'user_id' => $user->id,
      'title' => 'Mockup Generation',
    ]);

    GenerateMockup::dispatch(
      userId: $user->id,
      conversationId: $conversationId,
      mediaId: $media->id,
      environment: MockupEnvironment::from($request->input('environment'))->label(),
    );

    return response()->json([
      'message' => 'Mockup generation started',
      'conversation_id' => $conversationId,
    ], 202);
  }

  public function getMockupResult(Request $request, string $conversationId)
  {
    $conversation = AgentConversation::where('id', $conversationId)
      ->firstOrFail();

    $assistantMessage = $conversation->messages()
      ->where('role', 'assistant')
      ->first();

    if (!$assistantMessage) {
      return response()->json(['message' => 'Mockup not ready yet'], 202);
    }

    return response()->json($assistantMessage, 200);
  }

  public function recentSessions(Request $request)
  {
    $user = $request->user();

    $recentSessions = AgentConversationMessage::with(['artwork' => fn($q) => $q->select('id', 'title')])
      ->where('user_id', $user->id)
      ->where('role', 'assistant')
      ->latest()
      ->paginate(5);

    return response()->json($recentSessions);
  }
}
