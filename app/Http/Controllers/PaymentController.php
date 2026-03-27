<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaymentRequest;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
  // TODO: Add authorization checks
  public function store(PaymentRequest $request)
  {
    $user = $request->user();
    $payment = $user->payments()->create($request->validated());

    return response()->json([
      'message' => 'Payment recorded successfully.',
      'payment' => $payment,
    ], 201);
  }
}
