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
            <td align="center" class="otp-code">
                {{ $data['currency_code'] ?? '???' }}
                {{ ' ' }}
                {{ $data['total_amount'] ? number_format($data['total_amount']) : 'unknown' }}
            </td>
        </tr>
    </table>

    <p style="font-size: 14px; color: #888888;">
        This information is sent by <strong>Seindo Travel</strong>. Please check your transaction details and the latest
        payment status via the Seindo Travel website or our Android and iOS apps.
    </p>

    @include('emails.component.check-out-our-promotions')
@endsection
