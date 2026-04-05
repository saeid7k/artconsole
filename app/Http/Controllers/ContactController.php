<?php

namespace App\Http\Controllers;

use App\Helpers\DataHelper;
use App\Http\Requests\ContactStoreUpdateRequest;
use App\Models\Contact;
use App\Models\Invoice;
use App\Models\Media;
use App\Rules\Phone;
use Illuminate\Http\Request;

class ContactController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index(Request $request)
  {
    $user = auth()->user();
    $gallery = $user->currentGallery();

    $contacts = $gallery->contacts()
      ->when($request->search, function ($q) use ($request) {
        $search = '%' . strtolower($request->search) . '%';
        $q->where(function ($q) use ($search) {
          $q->whereRaw('LOWER(firstname) LIKE ?', $search)
            ->orWhereRaw('LOWER(lastname) LIKE ?', $search)
            ->orWhereRaw('LOWER(email) LIKE ?', $search)
            ->orWhereRaw('LOWER(phone) LIKE ?', $search)
            ->orWhereRaw('LOWER(relationship) LIKE ?', $search)
            ->orWhereRaw("LOWER(JSON_UNQUOTE(JSON_EXTRACT(address, '$.street'))) LIKE ?", $search)
            ->orWhereRaw("LOWER(JSON_UNQUOTE(JSON_EXTRACT(address, '$.city'))) LIKE ?", $search)
            ->orWhereRaw("LOWER(JSON_UNQUOTE(JSON_EXTRACT(address, '$.province'))) LIKE ?", $search)
            ->orWhereRaw("LOWER(JSON_UNQUOTE(JSON_EXTRACT(address, '$.postal_code'))) LIKE ?", $search)
            ->orWhereRaw("LOWER(JSON_UNQUOTE(JSON_EXTRACT(address, '$.country'))) LIKE ?", $search)
            ->orWhereRaw("LOWER(JSON_UNQUOTE(JSON_EXTRACT(business, '$.name'))) LIKE ?", $search)
            ->orWhereRaw("LOWER(JSON_UNQUOTE(JSON_EXTRACT(business, '$.title'))) LIKE ?", $search)
            ->orWhereRaw("LOWER(JSON_UNQUOTE(JSON_EXTRACT(business, '$.phone'))) LIKE ?", $search)
            ->orWhereRaw("LOWER(JSON_UNQUOTE(JSON_EXTRACT(business, '$.email'))) LIKE ?", $search)
            ->orWhereRaw("LOWER(JSON_UNQUOTE(JSON_EXTRACT(business, '$.website'))) LIKE ?", $search);
        });
      })
      ->when($request->sort_by && $request->sort_order, function ($q) use ($request) {
        if ($request->sort_by === 'full_name') {
          $q->orderBy('firstname', $request->sort_order)->orderBy('lastname', $request->sort_order);
        } elseif ($request->sort_by === 'formatted_address') {
          $q->orderByRaw("JSON_UNQUOTE(JSON_EXTRACT(address, '$.street')) " . ($request->sort_order === 'asc' ? 'ASC' : 'DESC'));
        } else {
          $q->orderBy($request->sort_by, $request->sort_order);
        }
      }, function ($q) {
        $q->orderBy('firstname', 'asc')->orderBy('lastname', 'asc');
      })
      ->when($request->relationship, function ($q) use ($request) {
        $relationships = explode(',', $request->relationship);
        $q->where(function ($qq) use ($relationships) {
          foreach ($relationships as $r) {
            $qq->orWhereJsonContains('relationship', $r);
          }
        });
      })
      ->paginate($request->per_page ?? 10)->withQueryString();

    return inertia('Contacts/Index', [
      'contacts' => $contacts
    ]);
  }

  /**
   * Show the form for creating a new resource.
   */
  public function create()
  {
    //
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request)
  {
    $this->authorize('create', Contact::class);

    $user = auth()->user();
    $gallery = $user->currentGallery();

    $validated = $request->validate([
      'name' => ['required_without_all:firstname,lastname', 'string', 'max:255'],
      'firstname' => ['required_without_all:name,lastname', 'string', 'max:255'],
      'lastname' => ['required_without_all:name,firstname', 'string', 'max:255'],
      'email' => ['nullable', 'email', 'max:100'],
      'country_code' => ['nullable', 'string', 'max:10'],
      'phone' => ['nullable', new Phone()],
      'address' => ['nullable', 'array'],
      'website' => ['nullable', 'url', 'max:100'],
      'relationship' => ['nullable', 'array'],
      'business' => ['nullable', 'array'],
      'birthday' => ['nullable', 'date'],
    ]);

    if (isset($validated['name'])) {
      [
        'firstname' => $validated['firstname'],
        'lastname' => $validated['lastname']
      ] = DataHelper::fullnameExplode($validated['name']);
    }

    $entry = $gallery->contacts()->create($validated);

    return Response()->json([
      'message' => 'Contact created successfully',
      'contact' => $entry
    ]);
  }

  /**
   * Display the specified resource.
   */
  public function show(Contact $contact)
  {
    $this->authorize('view', $contact);

    return inertia('Contacts/Show', [
      'contact' => $contact
    ]);
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(Contact $contact)
  {
    //
  }

  /**
   * Update the specified resource in storage.
   */
  public function storeUpdate(ContactStoreUpdateRequest $request)
  {
    $user = auth()->user();

    if ($request->mode == 'create') {
      $this->authorize('create', Contact::class);

      $gallery = $user->currentGallery();
      $contact = Contact::create([
        ...$request->except('contact_id'),
        'gallery_id' => $gallery->id
      ]);
      $contact->gallery()->associate($gallery);
      $contact->save();

      return Response()->json(['message' => 'Contact created successfully']);
    } else if ($request->mode == 'update') {
      $contact = Contact::find($request->contact_id);
      $this->authorize('update', $contact);

      $contact->update($request->except('contact_id'));

      return Response()->json(['message' => 'Contact updated successfully']);
    }
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Contact $contact)
  {
    $this->authorize('delete', $contact);

    $contact->delete();

    return Response()->json(['message' => 'Contact deleted successfully']);
  }

  public function updatePhoto(Request $request)
  {
    $contact = Contact::find($request->contact_id);

    $this->authorize('update', $contact);

    $request->validate([
      'contact_id' => ['required', 'exists:contacts,id'],
      'photo' => ['required', 'image', 'max:10240'], // max 10MB
    ]);


    $contact->addMediaFromRequest('photo')
      ->toMediaCollection('contact-photo');

    activity()
      ->performedOn($contact)
      ->log('updated contact photo');

    // delete previous photos
    $medias = $contact->getMedia('contact-photo');
    if ($medias->count() > 1) {
      $medias->sortByDesc('id')->skip(1)->each(function (Media $media) {
        $media->delete();
      });
    }

    return Response()->json(['message' => 'Contact photo updated successfully']);
  }

  public function updateRelationships(Request $request, Contact $contact)
  {
    $this->authorize('update', $contact);

    $request->validate([
      'relationships' => ['nullable', 'array'],
      'relationships.*' => ['string'],
    ]);

    $contact->relationship = $request->relationships ?? [];
    $contact->save();

    return Response()->json(['message' => 'Contact relationships updated successfully']);
  }

  public function getContacts(Request $request)
  {
    $this->authorize('viewAny', Contact::class);

    $user = auth()->user();
    $gallery = $user->currentGallery();

    $contacts = $gallery->contacts()
      ->select('id', 'firstname', 'lastname', 'address')
      ->orderBy('firstname', 'asc')
      ->orderBy('lastname', 'asc')
      ->get();

    return Response()->json($contacts);
  }

  public function getArtists(Request $request)
  {
    $this->authorize('viewAny', Contact::class);

    $user = auth()->user();
    $gallery = $user->currentGallery();

    $artists = $gallery->artists()
      ->select('id', 'firstname', 'lastname')
      ->orderBy('firstname', 'asc')
      ->orderBy('lastname', 'asc')
      ->get();

    return Response()->json($artists);
  }

  public function getFresh(Request $request)
  {
    $user = $request->user();
    $contact = $user->contacts()
      ->where('created_at', '>=', now()->subMinute())
      ->latest()
      ->first();

    return Response()->json($contact);
  }

  public function getInvoices(Request $request, Contact $contact)
  {
    $this->authorize('view', $contact);
    $this->authorize('viewAny', Invoice::class);

    $invoices = $contact->invoices()
      ->with('items', 'artworks')
      ->orderBy('id', 'desc')
      ->get();

    return response()->json($invoices);
  }
}
