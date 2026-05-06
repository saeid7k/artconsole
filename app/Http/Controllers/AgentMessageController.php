<?php

namespace App\Http\Controllers;

use App\Models\AgentConversationMessage;
use App\Models\Artwork;
use App\Models\Media;
use Illuminate\Http\Request;

class AgentMessageController extends Controller
{
  public function getMedia(Request $request, string $messageId)
  {
    $message = AgentConversationMessage::find($messageId);
    if (!$message) {
      return response()->json(['error' => 'Message not found'], 404);
    }

    $attachment = collect($message->attachments)->first();

    if (!$attachment) {
      return response()->json(['error' => 'Attachment not found'], 404);
    }

    $media = Media::find($attachment['media_id']);
    if (!$media) {
      return response()->json(['error' => 'Media not found'], 404);
    }

    return response()->json($media);
  }

  public function addToArtwork(Request $request)
  {
    $messageId = $request->input('message_id');
    $message = AgentConversationMessage::find($messageId);
    if (!$message) {
      return response()->json(['error' => 'Message not found'], 404);
    }

    $attachment = collect($message->attachments)->first();

    if (!$attachment) {
      return response()->json(['error' => 'Attachment not found'], 404);
    }

    $media = Media::find($attachment['media_id']);
    if (!$media) {
      return response()->json(['error' => 'Media not found'], 404);
    }
    $fileContent = file_get_contents($media->getPath());

    $artwork = Artwork::find($message->artwork_id);
    if (!$artwork) {
      return response()->json(['error' => 'Artwork not found'], 404);
    }

    $artwork->addMediaFromString($fileContent)
      ->usingFileName($media->file_name)
      ->withCustomProperties($media->custom_properties)
      ->toMediaCollection('artwork-images');

    return response()->json(['success' => 'Media added to artwork']);
  }
}
