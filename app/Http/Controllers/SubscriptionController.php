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
}
