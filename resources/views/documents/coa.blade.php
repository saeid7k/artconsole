@php
  $renderDataRow = function($label, $data) {
    return <<<HTML
      <div class="data-row">
        <span class="data-label">{$label}:</span>
        <span class="data-holder">{$data}</span>
      </div>
    HTML;
  };

  $fontEbGaramondBase64 = base64_encode(file_get_contents(Vite::asset('resources/fonts/EBGaramond.woff2')));
  $fontTangerineRegularBase64 = base64_encode(file_get_contents(Vite::asset('resources/fonts/Tangerine-Regular.woff2')));
  $fontTangerineBoldBase64 = base64_encode(file_get_contents(Vite::asset('resources/fonts/Tangerine-Bold.woff2')));
@endphp

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Certificate of Authenticity</title>
  <style>
    @font-face {
      font-family: 'EB Garamond';
      src: url("data:font/woff2;base64,{{ $fontEbGaramondBase64 }}") format('woff2-variations');
      font-weight: 100 900;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'Tangerine';
      src: url("data:font/woff2;base64,{{ $fontTangerineRegularBase64 }}") format('woff2');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'Tangerine';
      src: url("data:font/woff2;base64,{{ $fontTangerineBoldBase64 }}") format('woff2');
      font-weight: 700;
      font-style: normal;
      font-display: swap;
    }

    html, body {
      margin: 0;
      padding: 0;
    }

    .wrapper {
      width: 11in;
      height: 8.5in;
      font-size: 14pt;
      font-family: 'EB Garamond', 'Times New Roman', Times, serif;
      line-height: 1.5em;
      box-sizing: border-box;
      background-image: url("{{ Vite::asset('resources/documents/coa/coa-frame-01.svg') }}");
      background-size: contain;
      background-repeat: no-repeat;
    }

    .container {
      position: relative;
      padding: 0.75in;
      width: auto;
      height: 100%;
      box-sizing: border-box;
    }

    .border {
      border: 1px solid #ccc;
    }

    .header {
      width: max-content;
      text-align: center;
      margin: 0 auto 0.5in;
      font-family: 'Tangerine';
      /* text-transform: uppercase; */
    }

    .description {
      width: 6in;
      text-align: center;
      margin: 0 auto 0.5in;
    }

    .content {
      width: 8in;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 3fr 1fr;
      gap: 0.5in;
    }

    .data-row {
      display: flex;
      gap: 0.125in;
      width: 100%;
      margin-bottom: 0;
    }

    .data-label {
      min-width: 1.75in;
    }

    .data-holder {
      flex-grow: 1;
      border-bottom: 0.5pt solid #000;
    }

    .signature-row {
      position: absolute;
      bottom: 0.75in;
      display: flex;
      justify-content: space-between;
      gap: 2in;
      width: calc(11in - 1.5in);
      padding: 0 1in;
      box-sizing: border-box;
    }

    .signature-holder {
      border-top: 0.5pt solid #000;
      width: 2in;
      text-align: center;
      padding-top: 0;
    }
  </style>
</head>

<body>
  <div class="wrapper border">
    <div class="container">
      <div class="header">
        <h1 style="margin-bottom: 0.25in; font-size:48pt;">Certificate of Authenticity</h1>
        <h3 style="margin: 0; font-size: 24pt;">of Original Artwork</h3>
      </div>
      <div class="description">
        This is to certify that the artwork identified herein is an original and authentic work of art. The artist reserves all copyright and reproduction rights.
      </div>
      <div class="content" >
        <div>
          {!! $renderDataRow('Title of Work', $artwork->title) !!}
          {!! $renderDataRow('Artist', $artwork->artist_data->full_name) !!}
          {!! $renderDataRow('Dimensions', $artwork->formatted_dimensions) !!}
          {!! $renderDataRow('Medium & Materials', $artwork->formatted_medium) !!}
          {!! $renderDataRow('Year Created', $artwork->year) !!}
          {!! $renderDataRow('Edition', $artwork->formatted_edition) !!}
        </div>
        <div>
          <img
            src="{{ $artwork->mainImage->base64Content() }}"
            alt="Artwork Image"
            style="width: 100%; max-height: 2in; object-fit: contain;"
          />
        </div>
      </div>
      <div class="signature-row">
        <div class="signature-holder">Signature</div>
        <div class="signature-holder">Date Signed</div>
      </div>
    </div>
  </div>
</body>
</html>
