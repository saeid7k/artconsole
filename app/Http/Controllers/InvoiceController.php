<?php

namespace App\Http\Controllers;

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
}
