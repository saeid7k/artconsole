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
    ]);

    $suer = auth()->user();
    $gallery = $suer->currentGallery();

    $invoice = $gallery->invoices()->create($validated + [
      'user_id' => $suer->id,
      'status' => InvoiceStatus::default()->value,
    ]);

    return response()->json([
      'message' => 'Invoice created successfully',
      'invoice' => $invoice
    ], 201);
  }
}
