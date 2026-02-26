<?php

namespace App\Models;

use App\Traits\HasNotes;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Models\Activity;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Artwork extends Model implements HasMedia
{
  use HasFactory, InteractsWithMedia, LogsActivity, SoftDeletes, HasNotes;

  protected $fillable = [
    'creator_id',
    'gallery_id',
    'location_id',
    'artist_id',
    'artist_data',
    'sku',
    'title',
    'year',
    'price',
    'edition',
    'signed',
    'signature_note',
    'description',
    'category',
    'subjects',
    'mediums',
    'styles',
    'dimensions',
    'ownership',
    'owner_contact_id',
    'consignment_terms',
    'provenance',
    'acquisition_date',
    'acquisition_price',
    'details',
    'status',
  ];

  protected $casts = [
    'edition' => 'object',
    'signed' => 'boolean',
    'subjects' => 'array',
    'mediums' => 'array',
    'styles' => 'array',
    'dimensions' => 'object',
    'details' => 'object',
    'acquisition_date' => 'date',
    'acquisition_price' => 'decimal:2',
  ];

  // Appends

  protected $appends = ['abilities', 'main_image_url', 'main_image_thumb_url'];

  public function getAbilitiesAttribute(): array
  {
    $user = auth()->user();
    return [
      'create' => $user->can('create', Artwork::class),
      'view' => $user->can('view', $this),
      'update' => $user->can('update', $this),
      'delete' => $user->can('delete', $this),
    ];
  }

  public function getMainImageUrlAttribute(): ?string
  {
    $media = $this->media()->where('collection_name', 'artwork-images')
      ->where('custom_properties->is_main', true)
      ->first();
    return $media ? $media->getUrl() : null;
  }

  public function getMainImageThumbUrlAttribute(): ?string
  {
    $media = $this->media()->where('collection_name', 'artwork-images')
      ->where('custom_properties->is_main', true)
      ->first();
    return $media ? $media->getUrl('thumb') : null;
  }

  // Attributes

  public function artistData(): Attribute
  {
    return new Attribute(
      get: function ($value) {
        if ($this->artist_id) {
          return $this->artist;
        } else {
          $value = json_decode($value ?? '{}');
          $value = (array) $value;
          $value['full_name'] = trim(($value['firstname'] ?? '') . ' ' . ($value['lastname'] ?? ''));
          return (object) $value;
        }
      },
      set: fn ($value) => json_encode($value),
    );
  }

  public function edition(): Attribute
  {
    return new Attribute(
      set: function ($value) {
        $value['type'] = $value['type'] ?? 'unique';
        if ($value['type'] === 'unique') {
          $value['number'] = 1;
          $value['size'] = 1;
        } elseif ($value['type'] === 'open') {
          $value['size'] = null;
          $value['number'] = (int) $value['number'];
        } else {
          $value['number'] = (int) $value['number'];
          $value['size'] = (int) $value['size'];
        }
        return json_encode($value);
      },
    );
  }

  public function dimensions(): Attribute
  {
    return new Attribute(
      set: function ($value) {
        $value['height'] = isset($value['height']) ? (float) $value['height'] : null;
        $value['width'] = isset($value['width']) ? (float) $value['width'] : null;
        $value['depth'] = isset($value['depth']) ? (float) $value['depth'] : null;
        return json_encode($value);
      },
    );
  }

  // Relationships

  public function gallery()
  {
    return $this->belongsTo(Gallery::class);
  }

  public function location()
  {
    return $this->belongsTo(Location::class);
  }

  public function creator()
  {
    return $this->belongsTo(User::class, 'creator_id');
  }

  public function artist()
  {
    return $this->belongsTo(Contact::class, 'artist_id');
  }

  public function owner()
  {
    return $this->belongsTo(Contact::class, 'owner_contact_id');
  }

  public function mainImage(): HasOne
  {
    return $this->hasOne(Media::class, 'model_id')
      ->where('model_type', Artwork::class)
      ->where('collection_name', 'artwork-images')
      ->where('custom_properties->is_main', true);
  }

  // Methods

  public function registerMediaConversions(?Media $media = null): void
  {
    $this->addMediaConversion('thumb')
      ->width(200)
      ->height(200)
      ->sharpen(10)
      ->nonQueued();

    $this->addMediaConversion('small')
      ->width(40)
      ->height(40)
      ->sharpen(10)
      ->nonQueued();
  }

  public function getImagesAttribute()
  {
    return $this->media()
      ->where('collection_name', 'artwork-images')
      ->get();
  }

  // Activity Log

  public function getActivitylogOptions(): LogOptions
  {
    $options = LogOptions::defaults()
      ->logFillable()
      ->logExcept(['location_id'])
      ->dontSubmitEmptyLogs();

    if (!$this->wasRecentlyCreated) {
      $options->logOnlyDirty();
    }

    return $options->setDescriptionForEvent(function (string $event) {
      switch ($event) {
        case 'created':
          return "created the artwork";
        case 'updated':
          return "updated artwork details";
        case 'deleted':
          return "deleted the artwork";
        default:
          return $event;
      }
    });
  }

  public function tapActivity(Activity $activity, string $eventName)
  {
    if ($eventName === 'created') {
      $activity->properties = $activity->properties->merge([
        'location' => $this->location ? $this->location->name : null,
      ]);
      return;
    }
  }
}
