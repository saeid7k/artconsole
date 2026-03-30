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

    .wrapper {
      width: 8.5in;
      height: 1in;
      font-size: 14pt;
      font-family: 'Segoe UI', sans-serif;
      line-height: 1.5em;
      box-sizing: border-box;
      padding: 0.5in;
      margin-top: -0.25in;
    }

    .header {
      display: grid;
      grid-template-columns: 1fr 2fr 1fr;
      width: 100%;
    }

    .border {
      border: 1px solid #ccc;
    }
  </style>
</head>

<body>
  <div class="wrapper">
    <div class="header">
      <div class="border" style="color: red; background-color: gray;">logo</div>
      <div class="border" style="font-size:32pt; text-align: center;">Invoice</div>
      <div class="border">{{ $invoice->invoice_number }}</div>
    </div>
  </div>
</body>
</html>
