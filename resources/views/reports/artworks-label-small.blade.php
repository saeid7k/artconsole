<!DOCTYPE html>
<html lang="en">

<head>
  <style>
    .label-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: start;
      align-items: start;
      width: 100%;
      height: 10in;
      flex-wrap: wrap;
      gap: 0 0.125in;
    }
    .label {
      width: 2.625in;
      height: 1in; /* 1 inch */
      border: 1pt solid #000;
      font-size: 10pt;
      box-sizing: border-box;
      border-radius: 8pt;
      padding: 0.125in;
    }
  </style>
</head>

<body>
  <div class="report-wrapper">
    <div class="label-wrapper">
      @foreach ($artworks as $artwork)
          <div class="label">
            Name: {{ $artwork['title'] }}
          </div>
      @endforeach
    </div>
  </div>
</body>
