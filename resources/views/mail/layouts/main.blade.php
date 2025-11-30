<!DOCTYPE html>
<html lang="en">

<head>
  <title>@yield('title', config('app.name'))</title><meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
      <?php echo file_get_contents(resource_path('css/mails.css')); ?>
  </style>
</head>

<body>
  <div class="email-wrapper">
    <div class="header">
      @if(View::hasSection('header'))
        @yield('header')
      @else
        <h2>{{ config('app.name') }}</h2>
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
            {{ config('app.name') }} Team
          </p>
        @endif
      </div>
    </div>

    <div class="footer">
      @if(View::hasSection('footer'))
        @yield('footer')
      @else
        <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
      @endif
    </div>
  </div>
</body>

</html>
