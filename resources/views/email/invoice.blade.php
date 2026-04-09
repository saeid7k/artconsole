@extends('email.layouts.gallery')

@section('content')
<div>
  <h3>Dear {{ $invoice->contact->full_name }},</h3>
  <p>
    Thank you for your recent purchase from
    <strong>{{ $gallery->name }}</strong>.
  </p>
  <p>Please find your invoice attached to this email as a PDF.</p>
</div>
@endsection
