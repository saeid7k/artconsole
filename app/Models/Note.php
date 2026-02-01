<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Note extends Model
{
  use HasFactory, LogsActivity, SoftDeletes;

  protected $fillable = [
    'note',
    'user_id',
  ];

  // Relationships

  public function user()
  {
    return $this->belongsTo(User::class);
  }

  public function artworks()
  {
    return $this->belongsToMany(Artwork::class, 'artwork_note')
      ->withTimestamps();
  }

  // Activity Log

  public function getActivitylogOptions(): LogOptions
  {
    return LogOptions::defaults()
      ->logFillable()
      ->logOnlyDirty()
      ->dontSubmitEmptyLogs()
      ->setDescriptionForEvent(function (string $event) {
        switch ($event) {
          case 'created':
            return "created a note";
          case 'updated':
            return "updated note";
          case 'deleted':
            return "deleted a note";
          default:
            return $event;
        }
      });
  }
}
