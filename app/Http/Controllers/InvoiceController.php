<?php

namespace App\Http\Controllers;

use App\Enums\InvoiceStatus;
use App\Http\Requests\InvoiceRequest;
use App\Models\Invoice;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
  public function index(Request $request)
  {
    $this->authorize('viewAny', Invoice::class);
    $user = $request->user();
    $gallery = $user->currentGallery();
    $invoices = $gallery->invoices()
      ->with([
          'contact' => function ($query) {
            $query->select('id', 'firstname', 'lastname');
          }
        ])
      ->when($request->search, function ($q) use ($request) {
        $search = '%' . strtolower($request->search) . '%';
        $q->join('contacts', 'invoices.contact_id', '=', 'contacts.id')
        ->where(function ($qq) use ($search) {
          $qq->whereRaw('LOWER(number) LIKE ?', $search)
            ->orWhereRaw('LOWER(total) LIKE ?', $search)
            ->orWhereRaw('LOWER(notes) LIKE ?', $search)
            ->orWhereRaw('LOWER(status) LIKE ?', $search)
            ->orWhereRaw('CONCAT(LOWER(contacts.firstname), " ", LOWER(contacts.lastname)) LIKE ?', $search);
        });
      })
      ->when($request->sort_by, function ($q) use ($request) {
          if ($request->sort_by === 'contact') {
            $q->join('contacts', 'invoices.contact_id', '=', 'contacts.id')
              ->orderBy('contacts.firstname', $request->sort_order ?? 'asc')
              ->orderBy('contacts.lastname', $request->sort_order ?? 'asc');
          } else {
            $q->orderBy($request->sort_by, $request->sort_order ?? 'asc');
          }
        }, function ($q) {
          $q->orderBy('invoices.id', 'desc');
        })
      ->paginate($request->per_page ?? 10)->withQueryString();

    return inertia('Invoices/Index', [
      'invoices' => $invoices,
    ]);
  }

  public function get(Invoice $invoice)
  {
    $this->authorize('view', $invoice);
    $invoice->load('items.artwork', 'contact');
    return response()->json($invoice);
  }

  public function nextInvoiceNumber()
  {
    return response()->json([
      'next_invoice_number' => Invoice::nextInvoiceNumber(),
    ]);
  }

  public function store(InvoiceRequest $request)
  {
    $suer = auth()->user();
    $gallery = $suer->currentGallery();

    $invoice = $gallery->invoices()->create($request->all() + [
      'user_id' => $suer->id,
      'status' => InvoiceStatus::default()->value,
    ]);

    foreach ($request->items as $item) {
      $invoice->items()->create($item);
    }

    return response()->json([
      'message' => 'Invoice created successfully',
      'invoice' => $invoice
    ], 201);
  }
}
