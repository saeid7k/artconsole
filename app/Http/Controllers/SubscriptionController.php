<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Cashier\Cashier;

class SubscriptionController extends Controller
{
  public function index()
  {
    return inertia('Subscription');
  }

  public function getProducts()
  {
    $stripePrices = Cashier::stripe()->prices->all([
      'active' => true,
      'expand' => ['data.product','data.currency_options']
    ]);

    $products = [];
    foreach ($stripePrices->data as $price) {
      $productId = $price->product->id;
      if (!isset($products[$productId])) {
        $products[$productId] = [
          'id' => $productId,
          'name' => $price->product->name,
          'title' => $price->product->metadata->title ?? $price->product->name,
          'description' => $price->product->description,
          'prices' => []
        ];
      }
      $products[$productId]['prices'][] = [
        'id' => $price->id,
        'currency' => $price->currency,
        'amount' => $price->unit_amount,
        'currency_options' => $price->currency_options,
        'interval' => $price->recurring ? $price->recurring->interval : null,
        'interval_count' => $price->recurring ? $price->recurring->interval_count : null,
      ];
    }

    return response()->json(array_values($products));
  }

  public function subscribe(Request $request)
  {
    $request->validate([
      'price_id' => 'required|string',
    ]);

    $user = $request->user();
    $gallery = $user->currentGallery();
    $priceId = $request->input('price_id');

    try {
      $checkout = $gallery->newSubscription('default', $priceId)
        ->quantity($gallery->members()->count())
        ->checkout([
          'success_url' => route('subscription.index', [
            'checkout' => 'success',
          ]),
          'cancel_url' => route('subscription.index', [
            'checkout' => 'canceled',
          ]),
        ]);
    } catch (\Exception $e) {
      return response()->json([
        'message' => 'Failed to upgrade subscription plan: ' . $e->getMessage(),
      ], 500);
    }

    return response()->json([
      'checkout_url' => $checkout->url,
    ]);
  }

  public function getSubscriptionData(Request $request)
  {
    $user = $request->user();
    $gallery = $user->currentGallery();
    $subscription = $gallery->subscription();

    if (!$subscription) {
      return response()->json(null);
    }

    $stripeSubscription = $subscription->asStripeSubscription();
    $stripePrice = $stripeSubscription->items->data[0]->price;
    $productId = $stripePrice->product;
    $stripeProduct = $gallery->stripe()->products->retrieve($productId);

    $plan = [
      'id' => $stripePrice->id,
      'name' => $stripeProduct->name,
      'amount' => $stripePrice->unit_amount / 100,
      'currency' => $stripePrice->currency,
      'interval' => $stripePrice->recurring ? $stripePrice->recurring->interval : null,
      'interval_count' => $stripePrice->recurring ? $stripePrice->recurring->interval_count : null,
      'quantity' => $stripeSubscription->quantity,
      'current_period_start' => $stripeSubscription->items->data[0]->current_period_start,
      'current_period_end' => $stripeSubscription->items->data[0]->current_period_end,
    ];

    return response()->json([
      'plan' => $plan,
    ]);
  }
}
