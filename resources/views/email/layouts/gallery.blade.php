<!DOCTYPE html>
<html lang="en">

<head>
  <title>@yield('title', config('app.name'))</title><meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
      <?php echo file_get_contents(resource_path('css/email.css')); ?>
  </style>
</head>

<body>
  <div class="email-wrapper">
    <div class="header">
      @if(View::hasSection('header'))
        @yield('header')
      @else
        <img
          src="{{ $gallery->logo_url }}"
          alt="{{ $gallery->name }} Logo"
          class="mx-auto"
          style="max-height: 80px;"
        >
      @endif
    </div>

    <div class="content-container">
      <div class="content">
        @yield('content')
      </div>

      <div class="signature">
        @if(View::hasSection('signature'))
          @yield('signature')
        @else
          <p>
            Best regards,
            <br>
            {{ $gallery->name }}
          </p>
        @endif
      </div>
    </div>

    <div class="footer">
      @if(View::hasSection('footer'))
        @yield('footer')
      @else
        <p>
          Powered by
          <a
            href="{{ env('WEBSITE_URL') }}"
            style="text-decoration: none"
          >
            {{ config('app.name') }}
          </a>
        </p>
      @endif
    </div>
  </div>
</body>

</html>
