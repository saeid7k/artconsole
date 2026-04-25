<!DOCTYPE html>
<html>

<head>
  <style>
    html, body {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-size: 9pt;
    }

    body {
      padding: 0 0.1875in;
    }

    h1 {
      font-size: 14pt;
      font-family: 'Times New Roman', Times, serif;
    }

    .header-container {
      width: 100%;
      height: 1in;
      display: grid;
      grid-template-columns: 35% 30% 35%;
    }

    .border {
      border: 1px solid #ccc;
    }
  </style>
</head>

<body>
  <div class="header-container">
    <div>
      <img
        src="{{ $gallery->base64_logo }}"
        alt="Gallery Logo"
        style="max-height: 0.5in; max-width: 1in; object-fit: contain; margin-bottom: 0.0625in;"
      />
      <div style="font-size: 10pt;" >{{ $gallery->name }}</div>
    </div>
    <div style="text-align: center;" >
      <h1>{{ $report->type_title }}</h1>
    </div>
    <div style="text-align: right; padding-top: 0.25in; line-height: 1.5;" >
      <div>{{ $report->created_at->setTimezone($report->creator->timezone)->format('F j, Y') }}</div>
      <div>Total pieces: {{ count($report->artworks) }}</div>
    </div>
  </div>
</body>

</html>
