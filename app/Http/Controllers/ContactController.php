<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactUpdateRequest;
use App\Models\Contact;
use App\Models\Media;
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
    //
  }

    /**
     * Display the specified resource.
     */
    public function show(Contact $contact)
    {
      $this->authorize('view', $contact);

      return inertia('Contacts/View', [
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
  public function update(ContactUpdateRequest $request, Contact $contact)
  {
    $this->authorize('update', $contact);

    $contact->update($request->all());

    return Response()->json(['message' => 'Contact updated successfully']);
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
      ->toMediaCollection('contact_photo');

    activity()
      ->performedOn($contact)
      ->log('updated contact photo');

    // delete previous photos
    $medias = $contact->getMedia('contact_photo');
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
}
