<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TokenTransactionController extends Controller
{
  public function index(Request $request)
  {
    $user = $request->user();
    $transactions = $user->tokenTransactions()->latest()->paginate(10);

    return response()->json($transactions);
  }
}
