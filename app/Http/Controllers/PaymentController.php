<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaymentRequest;
use App\Models\Payment;

class PaymentController extends Controller
{
  public function store(PaymentRequest $request)
  {
    $this->authorize('store', Payment::class);
    $user = $request->user();
    $payment = $user->payments()->create($request->validated());

    return response()->json([
      'message' => 'Payment recorded successfully.',
      'payment' => $payment,
    ], 201);
  }
}
