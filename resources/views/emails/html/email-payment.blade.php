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
        Informasi ini dikirim oleh <strong>Seindo Travel</strong>. Silakan periksa detail transaksi dan status pembayaran
        terbaru melalui
        website Seindo Travel atau aplikasi Android dan iOS kami.
    </p>

    <div class="divider"></div>

    <p style="margin-top: 30px;">
        Sambil merencanakan liburan, yuk intip promo menarik dari kami!
    </p>

    <div style="margin: 35px 0;">
        <a href="#" class="btn">LIHAT PROMO KAMI</a>
    </div>
@endsection
