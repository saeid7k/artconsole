<?php

namespace App\Http\Controllers;

use App\Enums\InvoiceStatus;
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

  public function store(Request $request)
  {
    $validated = $request->validate([
      'contact_id' => 'required|exists:contacts,id',
      'number' => 'required|string|max:100',
      'date' => 'required|date',
      'due_date' => 'sometimes|nullable|date|after_or_equal:date',
      'items' => 'required|array|min:1',
      'tax_id' => 'sometimes|nullable|exists:taxes,id',
      'tax_rate' => 'sometimes|nullable|numeric',
      'subtotal' => 'required|decimal:0,2|max:9999999999.99',
      'available_extra_costs' => 'sometimes|nullable|array',
      'available_extra_costs.shipping' => 'sometimes|boolean',
      'available_extra_costs.discount' => 'sometimes|boolean',
      'shipping_cost' => 'sometimes|nullable|decimal:0,2|max:9999999999.99',
      'shipping_taxable' => 'sometimes|boolean',
      'discount_type' => 'sometimes|nullable|string|in:percentage,fixed',
      'discount_rate' => 'sometimes|nullable|decimal:0,2|max:9999999999.99',
      'discount_amount' => 'sometimes|nullable|decimal:0,2|max:9999999999.99',
      'tax_amount' => 'sometimes|nullable|decimal:0,2|max:9999999999.99',
      'total' => 'required|decimal:0,2|max:9999999999.99',
      'notes' => 'sometimes|nullable|string|max:500',
    ], [
      'contact_id.required' => 'Select customer for the invoice.',
      'contact_id.exists' => 'The selected contact is invalid.',
      'number.required' => 'The invoice number is required.',
      'date.required' => 'The invoice date is required.',
      'date.date' => 'The invoice date must be a valid date.',
      'due_date.date' => 'The due date must be a valid date.',
      'due_date.after_or_equal' => 'The due date must be after or equal to the invoice date.',
      'items.required' => 'At least one invoice item is required.',
      'items.array' => 'Items are not in the correct format.',
      'items.min' => 'At least one invoice item is required.',
      'notes.max' => 'Notes cannot exceed 500 characters.',
    ]);

    $suer = auth()->user();
    $gallery = $suer->currentGallery();

    $invoice = $gallery->invoices()->create($validated + [
      'user_id' => $suer->id,
      'status' => InvoiceStatus::default()->value,
    ]);

    foreach ($validated['items'] as $item) {
      $invoice->items()->create($item);
    }

    return response()->json([
      'message' => 'Invoice created successfully',
      'invoice' => $invoice
    ], 201);
  }
}
