<?php

namespace App\Http\Controllers;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
  public function index()
  {
    return inertia('Invoices/Index');
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
