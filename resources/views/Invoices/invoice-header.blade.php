@php
  $fontEbGaramondBase64 = base64_encode(file_get_contents(Vite::asset('resources/fonts/EBGaramond.woff2')));
  $fontTangerineRegularBase64 = base64_encode(file_get_contents(Vite::asset('resources/fonts/Tangerine-Regular.woff2')));
  $fontTangerineBoldBase64 = base64_encode(file_get_contents(Vite::asset('resources/fonts/Tangerine-Bold.woff2')));
  $fontSegoeUiBase64 = base64_encode(file_get_contents(Vite::asset('resources/fonts/SegoeUI.woff2')));
@endphp

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice</title>
  <style>
    @font-face {
      font-family: 'EB Garamond';
      src: url("data:font/woff2;base64,{{ $fontEbGaramondBase64 }}") format('woff2-variations');
      font-weight: 100 900;
      font-style: normal;
      font-display: swap;
    }

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
    }

    .wrapper {
      width: 8.5in;
      height: 2.25in;
      font-size: 9pt;
      font-family: 'Segoe UI', sans-serif;
      line-height: 1.5em;
      box-sizing: border-box;
      padding: 0.5in;
      margin-top: -0.25in;
      display: grid;
      grid-template-columns: 3fr 1fr;
    }

    .title {
      padding-top: 0.25in;
      text-align: center;
      font-family: 'EB Garamond', 'Times New Roman', Times, serif;
      font-size: 24pt;
    }

    .text-lg {
      font-size: 10pt;
    }

    .font-bold {
      font-weight: bold;
    }

    .font-light {
      font-weight: 300;
    }

    .border {
      border: 1px solid #ccc;
    }

    .grids-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    .line-clamp-3 {
      display: -webkit-box;
      line-clamp: 3;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  </style>
</head>

<body>
  <div class="wrapper">
    <div class="" >
      <img src="{{ $galleryLogo }}" alt="Gallery Logo" style="height: 0.75in; width: auto;">
      <div class="text-lg font-bold">{{ $gallery->name }}</div>
      <div class="font-light line-clamp-3">{!! nl2br($gallery->formatted_address_two_line) !!}</div>
      <div>{{ $gallery->email }}</div>
    </div>
    <div class="title">Invoice</div>
  </div>
</body>
</html>
