<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaymentRequest;
use App\Models\Payment;
use Illuminate\Http\Request;

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

  public function destroy(Request $request, Payment $payment)
  {
    $this->authorize('delete', $payment);
    $payment->delete();

    return response()->json([
      'message' => 'Payment deleted successfully.',
    ], 200);
  }
}
