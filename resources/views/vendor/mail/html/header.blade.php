@props(['url'])
<div class="logo-section">
    <a href="{{ $url }}" style="display: inline-block;"><img src={{ asset('assets/images/logo.png') }}
            alt="{config('app.name')}" /></a>
</div>

<div class="hero-banner">
    <img src="{{ asset('assets/images/email-banner.webp') }}" alt="Liburan Tanpa Batas" />
</div>
