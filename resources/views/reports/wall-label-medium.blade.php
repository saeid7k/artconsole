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
      gap: 0 0.1875in;
      box-sizing: content-box;
    }

    .label {
      width: 4in;
      height: 2in;
      font-size: 12pt;
      line-height: 1.5;
      box-sizing: border-box;
      border-radius: 8pt;
      padding: 0.25in;
      break-inside: avoid;
      page-break-inside: avoid;
      border: 1pt solid #0000;
    }

    .label-border {
      border: 1pt solid #000 !important;
    }

    .label > div {
      max-width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  </style>
</head>

<body>
  @php
    $options = $report->options;
    $perPage = $options->size == 'small' ? 30 : ($options->size == 'medium' ? 10 : 6);
  @endphp

  @foreach (collect($artworks)->chunk($perPage) as $chunk)
    <div class="labels-container @if(!$loop->last) page-break @endif">
      @foreach ($chunk as $artwork)
        <div @class([
          'label',
          'label-border' => $options->border ?? false,
        ])>
          @if ($options?->sku ?? false)
            <div style="text-align: right; font-size: 10pt;" >{{ $artwork->sku }}</div>
          @endif
          @if ($options?->artist_name ?? false)
            <div>{{ $artwork->artist?->full_name }}</div>
          @endif
          @if ($options?->artwork_title ?? false)
            <div style="font-weight: bold; font-style: italic;">{{ $artwork->title }}</div>
          @endif
          @if ($options?->mediums ?? false)
            <div>{{ $artwork->formatted_mediums }}</div>
          @endif
          @if ($options?->dimensions ?? false)
            <div>{{ $artwork->formatted_dimensions }}</div>
          @endif
          @if ($options?->price ?? false)
            <div>{{ $artwork->formatted_price }}</div>
          @endif
        </div>
      @endforeach
    </div>
  @endforeach
</body>
