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

    <p style="font-size: 14px; color: #888888; text-align: left;">
        For your security, this code will expire in [18] minutes. <strong>Do not share this code with anyone</strong>.
    </p>
    <p style="font-size: 14px; color: #888888; text-align: left;">
        If you did not request a password reset, you can safely ignore this email—your password will remain unchanged.
    </p>


    @include('emails.component.check-out-our-promotions')
@endsection
