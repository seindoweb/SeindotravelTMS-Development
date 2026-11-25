@extends('emails.layout')

@section('title')
    <h1>{{ $title ?? 'Title' }}</h1>
    <p style="font-size: 14px; color: #888888; text-align: left;">
        {{ $description ?? 'Description' }}
    </p>
@endsection

@section('content')
    <p style="font-size: 14px; color: #888888; text-align: left;">
        This email confirms that the password for your account was successfully changed. You can now log in using your new
        password..
    </p>

    @include('emails.component.check-out-our-promotions')
@endsection
