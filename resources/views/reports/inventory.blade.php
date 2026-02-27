<!DOCTYPE html>
<html lang="en">

<head>
  <style>
    html, body {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-size: 9pt;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead {
      background-color: #f5f5f5;
    }

    td, th {
      border: 1px solid #ccc;
      padding: 8px;
      vertical-align: top;
    }

    .text-light {
      color: #666;
    }

    .text-sm {
      font-size: 8pt;
    }
  </style>
</head>

<body>
  <table>
    <thead>
      <tr>
        @if ($report->options->checkbox ?? false)
          <th></th>
        @endif
        <th>Image</th>
        <th>SKU</th>
        <th>Details</th>
        <th>Artist / Year</th>
        <th>Price</th>
        <th>Status</th>
        @if ($report->options->notes ?? false)
        <th>Note</th>
        @endif
      </tr>
    </thead>
    <tbody>
      @foreach ($artworks as $artwork)
        <tr>
          @if ($report->options->checkbox ?? false)
            <td style="padding-top: 0.25in;">
              <input type="checkbox" />
            </td>
          @endif
          <td class="w-max">
            <img src="{{ $artwork->base64_image }}" alt="Thumbnail" style="width: 1in; height: 0.75in; object-fit: contain;" />
          </td>
          <td>
            <div class="text-sm" style="white-space: nowrap;">{{ $artwork->sku }}</div>
          </td>
          <td>
            <div>
              <div style="font-style: italic;">{{ $artwork->title }}</div>
              <div class="text-light text-sm">{{ $artwork->formatted_edition }}</div>
              <div class="text-light text-sm">{{ $artwork->formatted_mediums }}</div>
              <div class="text-light text-sm">{{ $artwork->formatted_dimensions }}</div>
            </div>
          </td>
          <td>
            <div>
              <div>{{ $artwork->artist?->full_name }}</div>
              <div class="text-light">{{ $artwork->year }}</div>
            </div>
          </td>
          <td>
            <div>{{ $artwork->formatted_price }}</div>
          </td>
          <td>
            <div>{{ $artwork->status }}</div>
          </td>
          @if ($report->options->notes ?? false)
          <td style="min-width: 1in;">
            <div></div>
          </td>
          @endif
        </tr>
      @endforeach
    </tbody>
  </table>
</body>
