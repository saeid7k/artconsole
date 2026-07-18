<?php

namespace App\Models;

use App\Enums\ArtworkStatus;
use App\Helpers\FormatHelper;
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
use App\Models\Media;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Spatie\MediaLibrary\MediaCollections\Models\Media as BaseMedia;

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
    'year', // e.g. 2023 | Circa 19th Century
    'price',
    'edition', // e.g. {type: [unique|limited|open], number: 1, size: 50}
    'signed',
    'signature_note',
    'description',

    'category',
    'subjects',
    'mediums',
    'styles',
    'dimensions',

    'ownership', // owned | consigned
    'acquisition_date',
    'acquisition_price',
    'owner_contact_id',
    'commission_mode', // percentage | fixed
    'commission_value',
    'consignment_terms',
    'provenance',

    'details',
    'status',
  ];

  protected $casts = [
    'price' => 'decimal:2',
    'edition' => 'object',
    'signed' => 'boolean',
    'subjects' => 'array',
    'mediums' => 'array',
    'styles' => 'array',
    'dimensions' => 'object',
    'details' => 'object',
    'acquisition_date' => 'date:Y-m-d',
    'acquisition_price' => 'decimal:2',
  ];

  /*
  |=======================================================
  | Accessors & Mutators
  |=======================================================
  */

  protected $appends = ['abilities', 'main_image_url', 'main_image_thumb_url', 'invoice_description'];

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

    if (!$media) {
      return null;
    }

    if (str_contains($media->mime_type ?? '', 'svg')) return $media->getUrl();
    return $media->hasGeneratedConversion('thumb') ? $media->getUrl('thumb') : $media->getUrl();
  }

  public function getInvoiceDescriptionAttribute(): string
  {
    $d = $this->title ?? '';
    $d .= $this->formatted_dimensions ? "\n" . $this->formatted_dimensions : '';
    $d .= $this->formatted_medium ? "\n" . $this->formatted_medium : '';
    return $d;
  }

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

  public function formattedDimensions(): Attribute
  {
    return new Attribute(
      get: function (?bool $showDepth = true) {
        return FormatHelper::formatDimensions($this->dimensions, $showDepth ?? true);
      },
    );
  }

  public function formattedEdition(): Attribute
  {
    return new Attribute(
      get: function () {
        $edition = $this->edition ? (array) $this->edition : null;
        if (!$edition || !isset($edition['type'])) {
          return '-';
        }

        return match ($edition['type']) {
          'unique' => 'Unique',
          'open' => "Open Edition, #{$edition['number']}",
          'limited' => "Limited Edition, #{$edition['number']}/{$edition['size']}",
          default => '-',
        };
      },
    );
  }

  public function formattedMedium(): Attribute
  {
    return new Attribute(
      get: function () {
        return FormatHelper::stringifyArray($this->mediums);
      },
    );
  }

  public function brief(): Attribute
  {
    return new Attribute(
      get: function () {
        $brief = [
          'Title' => $this->title,
          'Artist' => $this->artist_data->full_name ?? null,
          'Year' => $this->year,
          'Medium' => $this->formatted_medium,
          'Style' => FormatHelper::stringifyArray($this->styles),
          'Dimensions' => $this->formatted_dimensions,
          'Edition' => $this->formatted_edition,
          'category' => $this->category,
          'subjects' => FormatHelper::stringifyArray($this->subjects),
        ];
        return $brief;
      },
    );
  }

  /*
  |=======================================================
  | Relationships
  |=======================================================
  */

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

  public function invoices(): HasManyThrough
  {
    return $this->hasManyThrough(
      Invoice::class,
      InvoiceItem::class,
      'artwork_id',
      'id',
      'id',
      'invoice_id'
    );
  }

  public function lastInvoice(): HasOneThrough
  {
    return $this->hasOneThrough(Invoice::class, InvoiceItem::class, 'artwork_id', 'id', 'id', 'invoice_id')
      ->where('invoices.status', '!=', 'void')
      ->orderBy('invoices.id', 'desc');
  }

  /*
  |=======================================================
  | Methods
  |=======================================================
  */

  public function registerMediaConversions(?BaseMedia $media = null): void
  {
    if ($media && str_contains($media->mime_type ?? '', 'svg')) {
      return;
    }

    $this->addMediaConversion('thumb')
      ->width(200)
      ->height(200)
      ->format('webp')
      ->performOnCollections('artwork-images')
      ->nonQueued();

    $this->addMediaConversion('small')
      ->width(40)
      ->height(40)
      ->format('webp')
      ->performOnCollections('artwork-images')
      ->nonQueued();
  }

  public function getImagesAttribute()
  {
    return $this->media()
      ->where('collection_name', 'artwork-images')
      ->get();
  }

  /*
  |=======================================================
  | Scopes
  |=======================================================
  */

  public function scopeActive(Builder $query)
  {
    return $query->whereIn('status', ArtworkStatus::unSoldValues());
  }

  /*
  |=======================================================
  | Activity Log
  |=======================================================
  */

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
