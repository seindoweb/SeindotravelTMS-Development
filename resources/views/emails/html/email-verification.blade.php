@extends('emails.layout')

@section('title')
    <h1>{{ $title ?? 'Title' }}</h1>
    <p>
        {{ $description ?? 'Description' }}
    </p>
@endsection

@section('content')
    <table cellpadding="0" cellspacing="0" class="otp-box">
        <tr>
            <td align="center" class="otp-code">{{ $code ?? 'failed' }}</td>
        </tr>
    </table>

    <p style="font-size: 14px; color: #888888;">
        This code is valid for 18 minutes. <strong>Never share this OTP code with anyone</strong>.
    </p>

    @include('emails.component.check-out-our-promotions')
@endsection
