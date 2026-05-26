@php
  $fontSegoeUiBase64 = base64_encode(file_get_contents(base_path('resources/fonts/SegoeUI.woff2')));
  $defaultFooter = \App\Helpers\ConfigHelper::getDefault('invoice_footer');
  $appInfo = \App\Helpers\ConfigHelper::getAppInfo();
@endphp

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice</title>
  <style>
    @font-face {
      font-family: 'Segoe UI';
      src: url("data:font/woff2;base64,{{ $fontSegoeUiBase64 }}") format('woff2-variations');
      font-weight: 100 900;
      font-style: normal;
      font-display: swap;
    }

    html, body {
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .footer-wrapper {
      width: 8.5in;
      height: 0.5in;
      font-size: 8pt;
      font-family: 'Segoe UI', sans-serif;
      line-height: 1.5em;
      box-sizing: border-box;
      padding: 0 0.5in;
      vertical-align: bottom;
      text-align: center;
    }
    .page-number {
      width: 100%;
      text-align: right;
      color: #777;
    }
    #app-name {
      font-weight: bold;
      color: hsl(262.1 76.0% 58.2%);
      text-decoration: none;
    }
  </style>
</head>

<body>
  <div class="footer-wrapper">
    <div>
      {{ $gallery->meta['invoice_footer'] ?? $defaultFooter ?? null }}
    </div>
    @if ($gallery->meta['app_branding'] ?? true)
      <div>
        Powered by <a id="app-name" href="{{ env('WEBSITE_URL') }}" target="_blank" rel="noopener">{{ $appInfo['name'] }}</a> | {{ $appInfo['description_short'] }}
      </div>
    @endif
    <div class="page-number">
      Page @pageNumber of @totalPages
    </div>
  </div>
</body>
</html>
