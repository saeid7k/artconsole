<?php

namespace App\Http\Controllers;

use App\Models\TokenTransaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Laravel\Cashier\Cashier;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;

class TokenWebhookController extends Controller
{
  /**
   * Handle incoming Stripe webhook events for token top-ups.
   * This endpoint is separate from the subscription webhook to avoid conflicts
   * between the Gallery (subscription) and User (token) billable models.
   */
  public function handleWebhook(Request $request)
  {
    $payload = $request->getContent();
    $sigHeader = $request->header('Stripe-Signature');
    $secret = config('services.stripe.token_webhook_secret');

    try {
      $event = Webhook::constructEvent($payload, $sigHeader, $secret);
    } catch (SignatureVerificationException $e) {
      return response()->json(['message' => 'Invalid signature.'], 400);
    }

    match ($event->type) {
      'checkout.session.completed' => $this->handleCheckoutSessionCompleted($event->data->object),
      default => null,
    };

    return response()->json(['message' => 'Webhook handled.']);
  }

  /**
   * Credit tokens to the user when a top-up checkout session is completed.
   */
  protected function handleCheckoutSessionCompleted(object $session): void
  {
    if (($session->metadata->type ?? null) !== 'token_topup') {
      return;
    }

    $userId = $session->metadata->user_id ?? null;
    $tokens = (int) ($session->metadata->tokens ?? 0);

    if (!$userId || $tokens <= 0) {
      Log::warning('TokenWebhook: missing user_id or tokens in session metadata.', [
        'session_id' => $session->id,
      ]);
      return;
    }

    $user = User::find($userId);
    if (!$user) {
      Log::warning('TokenWebhook: user not found.', ['user_id' => $userId]);
      return;
    }

    // Prevent duplicate processing for the same checkout session.
    if (TokenTransaction::where('stripe_id', $session->id)->exists()) {
      return;
    }

    $user->tokenTransactions()->create([
      'type' => 'top_up',
      'amount' => $tokens,
      'description' => 'Token top-up via Stripe (session: ' . $session->id . ')',
      'stripe_id' => $session->id,
    ]);
  }
}
