@extends('email.layouts.app')

@section('content')
<div>
  <h3>Hello!</h3>
  <p>
    You have been invited to join
    <strong>{{ $gallery->name }}</strong>
    on
    <a
      href="{{ config('app.url') }}"
      style="text-decoration: none;"
    >
      <strong>{{ config('app.name') }}</strong>
    </a>
  </p>

  <p>To accept the invitation and join the team, please click the link below:</p>

  <p>
    <a
      class="button"
      href="{{ config('app.url') }}/join/{{ $inviteLink->token }}"
    >
      Accept Invitation
    </a>
  </p>

  <p>If you did not expect this invitation, you can safely ignore this email.</p>
</div>
@endsection
