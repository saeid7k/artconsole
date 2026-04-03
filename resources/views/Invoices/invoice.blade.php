@php
  $subtotal = \App\Helpers\FormatHelper::formatCurrency($invoice->subtotal, $gallery->currency);
  $shippingCost = \App\Helpers\FormatHelper::formatCurrency($invoice->shipping_cost, $gallery->currency);
  $discount = \App\Helpers\FormatHelper::formatCurrency($invoice->discount_amount, $gallery->currency);
  $taxAmount = \App\Helpers\FormatHelper::formatCurrency($invoice->tax_amount, $gallery->currency);
  $total = \App\Helpers\FormatHelper::formatCurrency($invoice->total, $gallery->currency);
  $amountDue = \App\Helpers\FormatHelper::formatCurrency($invoice->amount_due, $gallery->currency);
@endphp

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice</title>
  <style>
    html, body {
      margin: 0;
      padding: 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    thead tr {
      border-bottom: 1px solid #ccc;
    }
    td, th {
      padding: 4px;
      vertical-align: top;
      text-align: left;
    }
    td.amount, th.amount {
      text-align: right;
    }
    .wrapper {
      width: 8.5in;
      font-size: 8pt;
      font-family: 'Segoe UI', sans-serif;
      line-height: 1.5em;
      box-sizing: border-box;
      padding: 0 0.5in;
    }
    .totals-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5in;
      margin-top: 0.125in;
      padding: 0.125in 0;
      border-top: 1px solid #ccc;
    }
    .totals-container {
      line-height: 2em;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 0 4px;
      width: 2in;
      place-self: end;
    }
    #payments-container {
      margin: 0.125in 0;
      padding: 0.125in 0;
      border-top: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
    }
    .payment-row {
      display: flex;
      justify-content: space-between;
      padding: 0 4px;
    }
    .border {
      border: 1px solid #ccc;
    }
    .text-center {
      text-align: center;
    }
    .description {
      max-width: 2in;
    }
  </style>
</head>

<body>
  <div class="wrapper">
    <table>
      <thead>
        <tr>
          <th>Product / Service</th>
          <th>Description</th>
          <th class="text-center">Quantity</th>
          <th class="amount">Price</th>
          <th class="amount">Amount</th>
        </tr>
      </thead>
      <tbody>
        @foreach ($invoice->items as $item)
          <tr>
            <td>{{ $item->name }}</td>
            <td class="description">{!! nl2br($item->description) !!}</td>
            <td class="text-center">{{ $item->quantity }}</td>
            <td class="amount">{{ \App\Helpers\FormatHelper::formatCurrency($item->price, $gallery->currency) }}</td>
            <td class="amount">{{ \App\Helpers\FormatHelper::formatCurrency($item->quantity * $item->price, $gallery->currency) }}</td>
          </tr>
        @endforeach
      </tbody>
    </table>
    <div class="totals-section">
      <div>
        <b>Notes</b>
        <div>{{ $invoice->notes }}</div>
      </div>
      <div class="totals-container">
        <div class="totals-row">
          <span>Subtotal:</span>
          <span>{{ $subtotal }}</span>
        </div>
        @if ($invoice->available_extra_costs?->shipping ?? false)
          <div class="totals-row">
            <span>Shipping:</span>
            <span>{{ $shippingCost }}</span>
          </div>
        @endif
        @if ($invoice->available_extra_costs?->discount ?? false)
          <div class="totals-row">
            <span>Discount:</span>
            <span>{{ $discount }}</span>
          </div>
        @endif
        <div class="totals-row">
          <span>Tax ({{ (float) $invoice->tax_rate }}%):</span>
          <span>{{ $taxAmount }}</span>
        </div>
        <div class="totals-row">
          <b>Total:</b>
          <b>{{ $total }}</b>
        </div>
        @if ($invoice->payments->isNotEmpty())
          <div id="payments-container">
            <b>Payments</b>
            @foreach ($invoice->payments as $payment)
              <div class="payment-row">
                <div>
                  <div>
                    <span>{{ $payment->payment_date->format('M d, Y') }}</span>
                    <span> | </span>
                    <span>{{ \App\Enums\PaymentMethod::from($payment->payment_method)->label() }}</span>
                  </div>
                  @if ($payment->reference)
                    <div style="padding-left: 0.125in; line-height: 1em;">Reference: {{ $payment->reference }}</div>
                  @endif
                </div>
                <span>{{ \App\Helpers\FormatHelper::formatCurrency($payment->amount, $gallery->currency) }}</span>
              </div>
            @endforeach
          </div>
          <div class="totals-row">
            <b>Amount Due:</b>
            <b>{{ $amountDue }}</b>
          </div>
        @endif
      </div>
    </div>
  </div>
</body>
</html>
