<!DOCTYPE html>
<html lang="en">

<head>
  <style>

    html, body {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .labels-container {
      display: flex;
      flex-direction: column;
      justify-content: start;
      align-items: start;
      align-content: flex-start;
      width: 100%;
      height: 10in;
      flex-wrap: wrap;
      gap: 0 0.125in;
      box-sizing: content-box;
    }

    .label {
      width: 2.625in;
      height: 1in;
      font-size: 10pt;
      box-sizing: border-box;
      border-radius: 8pt;
      padding: 0.125in;
      break-inside: avoid;
      page-break-inside: avoid;
      border: 1pt solid #0000;
    }

    .label-border {
      border: 1pt solid #000 !important;
    }
  </style>
</head>

<body>
  @foreach (collect($artworks)->chunk(30) as $chunk)
    <div class="labels-container @if(!$loop->last) page-break @endif">
      @foreach ($chunk as $artwork)
        <div @class([
          'label',
          'label-border' => $report->options->border ?? false,
        ])>
          Name: {{ $artwork->title }}
        </div>
      @endforeach
    </div>
  @endforeach
</body>
