<?php

namespace App\Http\Controllers;

use App\Enums\ArtworkCategory;
use App\Enums\ArtworkStatus;
use App\Helpers\FormatHelper;
use App\Http\Requests\ArtworkStoreUpdateRequest;
use App\Models\Artwork;
use App\Models\Location;
use App\Services\ArtworkService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Spatie\LaravelPdf\Enums\Format;

use function Spatie\LaravelPdf\Support\pdf;

class ArtworkController extends Controller
{
  public function index(Request $request)
  {
    $this->authorize('viewAny', Artwork::class);

    $user = auth()->user();
    $gallery = $user->currentGallery();
    $artworks = $gallery->artworks()
      ->with([
        'artist:id,firstname,lastname',
        'owner:id,firstname,lastname',
        'location',
      ])
      ->when($request->search, function ($q) use ($request) {
        $search = '%' . strtolower($request->search) . '%';
        $q->where(function ($q) use ($search) {
          $q->whereRaw('LOWER(title) LIKE ?', $search)
            ->orWhereRaw('LOWER(signature_note) LIKE ?', $search)
            ->orWhereRaw('LOWER(description) LIKE ?', $search)
            ->orWhereRaw('LOWER(provenance) LIKE ?', $search)
            ->orWhereRaw('LOWER(sku) LIKE ?', $search);
        });
      })
      ->when($request->category, function ($q) use ($request) {
        $categories = explode(',', $request->category);
        $q->whereIn('category', $categories);
      })
      ->when($request->status, function ($q) use ($request) {
        $statuses = explode(',', $request->status);
        $q->whereIn('status', $statuses);
      })
      ->when($request->location, function ($q) use ($request) {
        $locationIds = explode(',', $request->location);
        $q->whereIn('location_id', $locationIds);
      })
      ->when($request->artist, function ($q) use ($request) {
        $artistIds = explode(',', $request->artist);
        $q->whereIn('artist_id', $artistIds);
      })
      ->when($request->medium, function ($q) use ($request) {
        $mediums = explode(',', $request->medium);
        $q->where(function ($q) use ($mediums) {
          foreach ($mediums as $medium) {
            $q->orWhereJsonContains('mediums', $medium);
          }
        });
      })
      ->when($request->style, function ($q) use ($request) {
        $styles = explode(',', $request->style);
        $q->where(function ($q) use ($styles) {
          foreach ($styles as $style) {
            $q->orWhereJsonContains('styles', $style);
          }
        });
      })
      ->when($request->ownership, function ($q) use ($request) {
        $ownerships = explode(',', $request->ownership);
        $q->whereIn('ownership', $ownerships);
      })
      ->when($request->sort_by && $request->sort_order, function ($q) use ($request) {
        $q->orderBy($request->sort_by, $request->sort_order);
      }, function ($q) {
        $q->orderBy('id', 'desc');
      })
      ->paginate($request->per_page ?? 10)->withQueryString();

    $locations = $gallery->locations()->get(['id', 'name']);

    return inertia('Artworks/Index', [
      'artworks' => $artworks,
      'locations' => $locations,
    ]);
  }

  public function show(Artwork $artwork)
  {
    $this->authorize('view', $artwork);

    $artwork->load([
      'location',
      'owner',
      'notes.creator:id,firstname,lastname'
    ]);
    $artwork->setRelation('images', $artwork->images);

    return inertia('Artworks/Show', [
      'artwork' => $artwork,
    ]);
  }

  public function storeUpdate(ArtworkStoreUpdateRequest $request)
  {
    if ($request->mode == 'create') {
      $this->authorize('create', Artwork::class);
      $user = auth()->user();
      $gallery = $user->currentGallery();
      $artwork = $gallery->artworks()->create($request->all());

      if ($request->hasFile('images')) {
        foreach ($request->file('images') as $image) {
          $artwork->addMedia($image)->toMediaCollection('artwork-images');
        }
      }

      return response()->json([
        'message' => 'Artwork created successfully.',
        'artwork_id' => $artwork->id,
      ]);
    } elseif ($request->mode == 'update') {
      $artwork = Artwork::find($request->artwork_id);
      $this->authorize('update', $artwork);

      $artwork->update($request->all());
      return response()->json([
        'message' => 'Artwork updated successfully.',
        'artwork_id' => $artwork->id,
      ]);
    }
  }

  public function destroy(Artwork $artwork)
  {
    $this->authorize('delete', $artwork);

    $artwork->delete();

    return response()->json([
      'message' => 'Artwork deleted successfully.',
    ]);
  }

  public function generateSku(Request $request)
  {
    $this->authorize('viewAny', Artwork::class);

    $request->validate([
      'artwork' => ['nullable', 'exists:artworks,id'],
      'category' => ['nullable', 'string', 'in:' . ArtworkCategory::stringifyAll()],
    ]);

    $artwork = $request->artwork ? Artwork::find($request->artwork) : null;
    $artworkService = new ArtworkService($artwork);
    $sku = $artworkService->newSku($request->category ?? ($artwork ? $artwork->category : null));

    return response()->json([
      'message' => 'SKU generated successfully.',
      'sku' => $sku,
    ]);
  }

  public function moveLocation(Request $request, Artwork $artwork)
  {
    $this->authorize('update', $artwork);

    $request->validate([
      'location_id' => ['required', 'exists:locations,id'],
      'reason' => ['nullable', 'string', 'max:200'],
    ]);

    $prevLocationId = $artwork->location_id;

    if ($prevLocationId == $request->location_id) {
      return response()->json([
        'message' => 'Artwork is already in the selected location.',
      ]);
    }

    $artwork->location_id = $request->location_id;
    activity()->withoutLogs(function () use ($artwork) {
      $artwork->save();
    });

    activity('artwork-move')
      ->causedBy(auth()->user())
      ->performedOn($artwork)
      ->withProperties([
          'prev_location' => Location::find($prevLocationId)->name ?? null,
          'new_location' => Location::find($request->location_id)->name ?? null,
          'reason' => $request->reason,
        ])
      ->log('moved the artwork to new location');

    return response()->json([
      'message' => 'Artwork moved successfully.',
    ]);
  }

  public function images(Artwork $artwork)
  {
    $this->authorize('view', $artwork);

    $images = $artwork->images->toArray();

    return response()->json([
      'images' => $images,
    ]);
  }

  public function uploadImages(Request $request, Artwork $artwork)
  {
    $this->authorize('update', $artwork);

    $request->validate([
      'files.*' => ['required', 'file', 'mimetypes:image/*', 'max:10240'],
    ], [
      'files.*.mimetypes' => 'Only image files are allowed.',
      'files.*.max' => 'Each image must not exceed 10 MB in size.',
    ]);

    if ($request->hasFile('files')) {
      foreach ($request->file('files') as $image) {
        $artwork->addMedia($image)->toMediaCollection('artwork-images');
      }
    }

    return response()->json([
      'message' => 'Images uploaded successfully.',
    ]);
  }

  public function renameImage(Request $request, Artwork $artwork)
  {
    $this->authorize('update', $artwork);

    $request->validate([
      'media_id' => ['required', 'exists:media,id'],
      'new_name' => ['required', 'string', 'max:255'],
    ]);

    $mediaItem = $artwork->getMedia('artwork-images')->where('id', $request->media_id)->first();
    if ($mediaItem) {
      $mediaItem->file_name = $request->new_name;
      $mediaItem->save();
    }

    return response()->json([
      'message' => 'Image renamed successfully.',
    ]);
  }

  public function setAsMainImage(Request $request, Artwork $artwork)
  {
    $this->authorize('update', $artwork);

    $request->validate([
      'media_id' => ['required', 'exists:media,id'],
    ]);

    (new ArtworkService($artwork))->setMainImage($request->media_id);

    return response()->json([
      'message' => 'Main image set successfully.',
    ]);
  }

  public function downloadImage(Artwork $artwork, $media_id)
  {
    $this->authorize('view', $artwork);

    $media = $artwork->getMedia('artwork-images')->where('id', $media_id)->first();
    $fileExists = $media ? Storage::disk($media->disk)->exists($media->getPathRelativeToRoot()) : false;

    if (!$media || !$fileExists) {
      return abort(404, 'Image not found.');
    }

    return Storage::disk($media->disk)->download(
      $media->getPathRelativeToRoot(),
      $media->file_name,
      ['Content-Type' => $media->mime_type]
    );
  }

  public function deleteImage(Artwork $artwork, $media_id)
  {
    $this->authorize('update', $artwork);

    $mediaItem = $artwork->getMedia('artwork-images')->where('id', $media_id)->first();
    if ($mediaItem) {
      $isMainImage = $mediaItem->getCustomProperty('is_main', false);
      $mediaItem->delete();
      if ($isMainImage) {
        (new ArtworkService($artwork))->ensureHasMainImage();
      }
    } else {
      return response()->json([
        'message' => 'Image not found.',
      ], 404);
    }

    return response()->json([
      'message' => 'Image deleted successfully.',
    ]);
  }

  public function saveNote(Request $request, Artwork $artwork)
  {
    $this->authorize('update', $artwork);

    $request->validate([
      'note_id' => ['nullable', 'exists:notes,id'],
      'content' => ['nullable', 'string', 'max:1000'],
    ]);

    if ($request->note_id) {
      $updated = $artwork->updateNote($request->note_id, $request->content);
      if ($updated) {
        return response()->json([
          'message' => 'Note updated successfully.',
          'note_id' => $request->note_id,
        ]);
      } else {
        return response()->json([
          'message' => 'Note not found.'
        ], 404);
      }
    }

    $note = $artwork->addNote($request->content);

    return response()->json([
      'message' => 'Note added successfully.',
      'note_id' => $note->id,
    ]);
  }

  public function copy(Artwork $artwork)
  {
    $this->authorize('create', Artwork::class);

    $newArtwork = $artwork->replicate([
      'sku', 'title', 'created_at', 'updated_at'
    ]);
    $newArtwork->title = $artwork->title . ' (Copy)';
    $newArtwork->save();

    foreach ($artwork->getMedia('artwork-images') as $mediaItem) {
      $isMain = $mediaItem->getCustomProperty('is_main', false);

      $fileContents = file_get_contents($mediaItem->getPath());
      $newArtwork->addMediaFromString($fileContents)
        ->usingFileName($mediaItem->file_name)
        ->withCustomProperties(['is_main' => $isMain])
        ->toMediaCollection('artwork-images');
    }

    return response()->json([
      'message' => 'Artwork copied successfully.',
      'artwork_id' => $newArtwork->id,
    ]);
  }

  public function massMoveLocation(Request $request)
  {
    $user = auth()->user();
    $gallery = $user->currentGallery();
    if (!$gallery->hasEditAccess($user)) {
      return response()->json([
        'message' => 'Unauthorized',
      ], 403);
    }

    $request->validate([
      'artwork_ids' => ['required', 'array'],
      'artwork_ids.*' => ['integer', 'exists:artworks,id'],
      'location_id' => ['required', 'exists:locations,id'],
      'reason' => ['nullable', 'string', 'max:200'],
    ]);

    $artworks = $gallery->artworks()->whereIn('id', $request->artwork_ids)->get();
    foreach ($artworks as $artwork) {
      $prevLocationId = $artwork->location_id;

      if ($prevLocationId == $request->location_id) {
        continue;
      }

      $artwork->location_id = $request->location_id;
      activity()->withoutLogs(function () use ($artwork) {
        $artwork->save();
      });

      activity('artwork-move')
        ->causedBy(auth()->user())
        ->performedOn($artwork)
        ->withProperties([
            'prev_location' => Location::find($prevLocationId)->name ?? null,
            'new_location' => Location::find($request->location_id)->name ?? null,
            'reason' => $request->reason,
          ])
        ->log('moved the artwork to new location');
    }

    return response()->json([
      'message' => 'Artworks moved successfully.',
    ]);
  }

  public function massUpdateStatus(Request $request)
  {
    $user = auth()->user();
    $gallery = $user->currentGallery();
    if (!$gallery->hasEditAccess($user)) {
      return response()->json([
        'message' => 'Unauthorized',
      ], 403);
    }

    $request->validate([
      'artwork_ids' => ['required', 'array'],
      'artwork_ids.*' => ['integer', 'exists:artworks,id'],
      'status' => ['required', 'string', 'in:' . ArtworkStatus::stringifyAll()],
    ]);

    $gallery->artworks()->whereIn('id', $request->artwork_ids)->update(['status' => $request->status]);

    return response()->json([
      'message' => 'Artworks status updated successfully.',
    ]);
  }

  public function search(Request $request)
  {
    $this->authorize('viewAny', Artwork::class);

    $request->validate([
      'query' => ['sometimes', 'nullable', 'string'],
      'all' => ['sometimes', 'boolean'],
    ]);

    $user = auth()->user();
    $gallery = $user->currentGallery();

    $artworksQuery = $gallery->artworks()
      ->when($request->query, function ($q) use ($request) {
        $search = '%' . strtolower($request->input('query')) . '%';
        $q->where(function ($qq) use ($search) {
          $qq->whereRaw('LOWER(title) LIKE ?', $search)
            ->orWhereRaw('LOWER(sku) LIKE ?', $search);
        });
      });

    if ($request->all) {
      $count = $artworksQuery->count();
      $artworks = $artworksQuery->paginate($count > 1000 ? 1000 : $count);
    } else {
      $artworks = $artworksQuery->paginate(10);
    }

    return response()->json($artworks);
  }

  public function renderDocument(Request $request, Artwork $artwork)
  {
    $this->authorize('view', $artwork);

    $request->validate([
      'type' => ['required', 'string', 'in:coa'],
    ]);

    $artwork->load(['artist']);

    $viewPath = match ($request->input('type')) {
      'coa' => 'documents.coa',
      default => null,
    };

    return view($viewPath, [
      'artwork' => $artwork,
    ]);
  }

  public function downloadDocument(Request $request, Artwork $artwork)
  {
    $this->authorize('view', $artwork);

    $request->validate([
      'type' => ['required', 'string', 'in:coa'],
    ]);

    $artwork->load(['artist']);

    $viewPath = match ($request->input('type')) {
      'coa' => 'documents.coa',
      default => null,
    };

    $pdf = pdf()
      ->view($viewPath, ['artwork' => $artwork])
      ->format(Format::Letter)
      ->landscape();

    return $pdf;
  }
}
