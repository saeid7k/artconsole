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
        <th>Image</th>
        <th>SKU</th>
        <th>Details</th>
        <th>Artist / Year</th>
        <th>Price</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      @foreach ($artworks as $artwork)
        <tr>
          <td class="w-max">
            <img src="{{ $artwork->base64_image }}" alt="Thumbnail" style="width: 100px; height: 50px; object-fit: contain;" />
          </td>
          <td>
            <div>{{ $artwork->sku }}</div>
          </td>
          <td>
            <div class="flex flex-col gap-1">
              <div style="font-style: italic;">{{ $artwork->title }}</div>
              <div class="text-light text-sm">{{ $artwork->formatted_edition }}</div>
              <div class="text-light text-sm">{{ $artwork->formatted_mediums }}</div>
              <div class="text-light text-sm">{{ $artwork->formatted_dimensions }}</div>
            </div>
          </td>
          <td>
            <div class="flex flex-col gap-1">
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
        </tr>
      @endforeach
    </tbody>
  </table>
</body>
