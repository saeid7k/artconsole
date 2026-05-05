<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class AgentConversationMessage extends Model implements HasMedia
{
  use InteractsWithMedia;

  protected $keyType = 'string';
  public $incrementing = false;

  protected $fillable = [
    'id',
    'conversation_id',
    'user_id',
    'agent',
    'role',
    'content',
    'attachments',
    'tool_calls',
    'tool_results',
    'usage',
    'meta',
  ];

  protected $casts = [
    'attachments' => 'array',
    'tool_calls' => 'array',
    'tool_results' => 'array',
    'usage' => 'array',
    'meta' => 'array',
  ];

  public function conversation(): BelongsTo
  {
    return $this->belongsTo(AgentConversation::class, 'conversation_id');
  }

  public function getArtworkIdAttribute(): ?int
  {
    return $this->meta['artwork_id'] ?? null;
  }

  public function artwork(): BelongsTo
  {
    return $this->belongsTo(Artwork::class, 'artwork_id');
  }
}
