
<div>
    <h2>You have been invited to join {{ $gallery->name }} on {{ config('app.name') }}</h2>

    <p>To accept the invitation and join the team, please click the link below:</p>

    <p>
        <a href="{{ config('app.url') }}">Accept Invitation</a>
    </p>

    <p>If you did not expect this invitation, you can safely ignore this email.</p>

    <p>
      Thank you,
      <br>
      {{ config('app.name') }} Team
    </p>
</div>
