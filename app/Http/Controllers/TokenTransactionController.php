<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Cashier\Cashier;

class TokenTransactionController extends Controller
{
  public function index(Request $request)
  {
    $user = $request->user();
    $transactions = $user->tokenTransactions()->latest()->paginate(10);

    return response()->json($transactions);
  }

  /**
   * List available one-time token top-up packages from Stripe.
   * Only returns products that have the metadata key "token_topup" = "true".
   */
  public function getPackages()
  {
    $stripePrices = Cashier::stripe()->prices->all([
      'active' => true,
      'type' => 'one_time',
      'expand' => ['data.product', 'data.currency_options'],
    ]);

    $packages = [];
    foreach ($stripePrices->data as $price) {
      if (($price->product->metadata->token_topup ?? null) !== 'true') {
        continue;
      }

      $currencies = [$price->currency => $price->unit_amount];

      foreach (($price->currency_options ?? []) as $currency => $options) {
        $currencies[$currency] = $options->unit_amount;
      }

      $packages[] = [
        'price_id' => $price->id,
        'product_id' => $price->product->id,
        'name' => $price->product->name,
        'description' => $price->product->description,
        'amount' => $price->unit_amount,
        'currency' => $price->currency,
        'currencies' => $currencies,
        'tokens' => (int) ($price->product->metadata->tokens ?? 0),
      ];
    }

    return response()->json($packages);
  }

  /**
   * Create a Stripe Checkout session for a one-time token top-up.
   */
  public function checkout(Request $request)
  {
    $request->validate([
      'price_id' => 'required|string',
    ]);

    $user = $request->user();
    $priceId = $request->input('price_id');

    try {
      $price = Cashier::stripe()->prices->retrieve($priceId, ['expand' => ['product']]);

      if (
        ($price->product->metadata->token_topup ?? null) !== 'true' ||
        $price->type !== 'one_time'
      ) {
        return response()->json([
          'message' => 'Invalid top-up package.',
        ], 422);
      }

      $tokens = (int) ($price->product->metadata->tokens ?? 0);

      $checkout = $user->checkout([$priceId => 1], [
        'success_url' => route('dashboard', ['token-topup' => 'success']),
        'cancel_url' => route('dashboard', ['token-topup' => 'canceled']),
        'metadata' => [
          'user_id' => $user->id,
          'tokens' => $tokens,
          'type' => 'token_topup',
        ],
      ]);
    } catch (\Exception $e) {
      return response()->json([
        'message' => 'Failed to create checkout session: ' . $e->getMessage(),
      ], 500);
    }

    return response()->json([
      'checkout_url' => $checkout->url,
    ]);
  }
}
