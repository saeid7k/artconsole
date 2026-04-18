<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Cashier\Cashier;

class SubscriptionController extends Controller
{
  public function index(Request $request)
  {
    $user = $request->user();
    $gallery = $user->currentGallery();

    return inertia('Subscription', [
      'billing_to' => $gallery->getMeta('billing_to', 'gallery'),
    ]);
  }

  public function getProducts()
  {
    $stripePrices = Cashier::stripe()->prices->all([
      'active' => true,
      'expand' => ['data.product', 'data.currency_options']
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

  public function cancelSubscription(Request $request)
  {
    $user = $request->user();
    $gallery = $user->currentGallery();
    $subscription = $gallery->subscription();

    if (!$subscription) {
      return response()->json([
        'message' => 'No active subscription found.',
      ], 404);
    }

    try {
      $subscription->cancel();
    } catch (\Exception $e) {
      return response()->json([
        'message' => 'Failed to cancel subscription: ' . $e->getMessage(),
      ], 500);
    }

    return response()->json([
      'message' => 'Subscription canceled successfully.',
    ]);
  }

  public function resumeSubscription(Request $request)
  {
    $user = $request->user();
    $gallery = $user->currentGallery();
    $subscription = $gallery->subscription();

    if (!$subscription) {
      return response()->json([
        'message' => 'No active subscription found.',
      ], 404);
    }

    try {
      $subscription->resume();
    } catch (\Exception $e) {
      return response()->json([
        'message' => 'Failed to resume subscription: ' . $e->getMessage(),
      ], 500);
    }

    return response()->json([
      'message' => 'Subscription resumed successfully.',
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
      'status' => $stripeSubscription->status,
      'cancel_at_period_end' => $stripeSubscription->cancel_at_period_end,
      'auto_renew' => $subscription->active() && !$subscription->canceled(),
    ];

    $upcomingInvoice = $gallery->upcomingInvoice()->toArray();
    $stripeTaxId = $upcomingInvoice['total_taxes'][0]['tax_rate_details']['tax_rate'] ?? null;
    $stripeTaxRate = $stripeTaxId ? $gallery->stripe()->taxRates->retrieve($stripeTaxId) : null;
    $upcomingInvoice['tax_rate'] = $stripeTaxRate;

    return response()->json([
      'plan' => $plan,
      'upcomingInvoice' => $upcomingInvoice,
      'paymentMethods' => $gallery->paymentMethods(),
      'defaultPaymentMethod' => $gallery->defaultPaymentMethod()
    ]);
  }

  public function getPaymentMethodLink(Request $request)
  {
    $user = $request->user();
    $gallery = $user->currentGallery();
    $checkout = $gallery->checkout([], [
      'mode' => 'setup',
      'currency' => $gallery->currency,
      'automatic_tax' => ['enabled' => false],
      'success_url' => route('subscription.index', [
        'add_payment_method' => 'success',
      ]),
      'cancel_url' => route('subscription.index', [
        'add_payment_method' => 'canceled',
      ]),
    ]);

    return response()->json([
      'url' => $checkout->url
    ]);
  }

  public function setDefaultPaymentMethod(Request $request)
  {
    $request->validate([
      'payment_method_id' => 'required|string',
    ]);

    $user = $request->user();
    $gallery = $user->currentGallery();
    $paymentMethodId = $request->input('payment_method_id');

    try {
      $gallery->updateDefaultPaymentMethod($paymentMethodId);
    } catch (\Exception $e) {
      return response()->json([
        'message' => 'Failed to set default payment method: ' . $e->getMessage(),
      ], 500);
    }

    return response()->json([
      'message' => 'Default payment method updated successfully.',
    ]);
  }

  public function deletePaymentMethod(Request $request)
  {
    $request->validate([
      'payment_method_id' => 'required|string',
    ]);
    $paymentMethodId = $request->input('payment_method_id');
    $user = $request->user();
    $gallery = $user->currentGallery();

    try {
      $gallery->deletePaymentMethod($paymentMethodId);
    } catch (\Exception $e) {
      return response()->json([
        'message' => 'Failed to delete payment method: ' . $e->getMessage(),
      ], 500);
    }

    return response()->json([
      'message' => 'Payment method deleted successfully.',
    ]);
  }

  public function setBillingTo(Request $request)
  {
    $request->validate([
      'billing_to' => 'required|in:gallery,owner',
    ]);

    $user = $request->user();
    $gallery = $user->currentGallery();
    $gallery->setMeta('billing_to', $request->input('billing_to'));

    dispatch(fn() => $gallery->syncStripeCustomerDetails());

    return response()->json([
      'message' => 'Billing preference updated successfully.',
    ]);
  }
}
