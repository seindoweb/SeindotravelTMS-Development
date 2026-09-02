<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">


<head>
    <title>{{ config('app.name') }}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <style>
        * {
            margin: 0;
            border: 0;
            padding: 0;
        }

        body {
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
                'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
            position: relative;
            background-color: #f7f8f9;
            font-size: 16px;
            color: #4a4a4a;
        }

        .wrapper {
            background-color: #ffffff;
            border-radius: 24px;
            box-shadow: 0 10px 30px rgba(230, 57, 70, 0.08);
            overflow: hidden;
        }

        /* Header */
        .header-icons {
            background-color: #E63946;
            padding: 12px;
            text-align: center;
        }

        .social {
            margin: 0 auto;
        }

        .social td {
            padding: 0 5px;
        }

        .social img {
            max-width: 32px;
            display: block;
        }

        /* Logo */
        .logo-section {
            text-align: center;
            padding: 15px 0;
        }

        .logo-section img {
            max-width: 170px;
        }

        /* Hero */
        .hero-banner img {
            width: 100%;
            display: block;
        }

        /* Konten */
        .content-section {
            padding: 40px 30px 20px 30px;
            text-align: center;
        }

        .content-section h1 {
            color: #E63946;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 15px;
        }

        .content-section p {
            line-height: 1.7;
            margin-bottom: 25px;
            color: #666666;
            font-size: 15px;
        }

        /* otp box */
        .otp-box {
            background-color: #fff9f9;
            border: 2px dashed #E63946;
            border-radius: 12px;
            margin: 25px auto;
            width: 100%;
            max-width: 300px;
        }

        .otp-code {
            font-size: 36px;
            font-weight: 700;
            color: #E63946;
            letter-spacing: 5px;
            padding: 20px;
        }

        /* tombol */
        .btn {
            background-color: #E63946;
            color: #ffffff;
            text-decoration: none;
            padding: 16px 45px;
            border-radius: 35px;
            font-weight: 600;
            display: inline-block;
            letter-spacing: 0.5px;
            box-shadow: 0 6px 20px rgba(230, 57, 70, 0.3);
        }

        /* Grid 3 */
        .features {
            width: 100%;
        }

        .feature-col {
            width: 33.33%;
            text-align: center;
            padding: 0 10px;
            vertical-align: top;
        }

        .feature-card {
            background-color: #ffffff;
            border: 1px solid #f9ecec;
            border-radius: 18px;
            box-shadow: 0 5px 15px rgba(230, 57, 70, 0.04);
            width: 100%;
        }

        .feature-card td {
            padding: 25px 15px;
        }

        .feature-card h3 {
            font-size: 16px;
            color: #E63946;
            margin: 18px 0 10px;
            font-weight: 700;
        }

        .feature-card p {
            font-size: 13px;
            color: #777;
            line-height: 1.6;
            margin: 0;
        }

        .feature-card img {
            max-width: 55px;
        }

        /* Footer */
        .footer {
            background-color: #E63946;
            color: #ffffff;
            text-align: center;
        }

        .footer td {
            padding: 35px 20px;
            font-size: 14px;
            line-height: 1.8;
        }

        .footer p {
            margin-bottom: 10px;
        }

        .footer a {
            color: #ffffff;
            font-weight: 600;
            text-decoration: underline;
        }

        .divider {
            height: 1px;
            background-color: #fcebeb;
            margin: 40px auto 20px auto;
            width: 100%;
        }
    </style>
</head>


<body style="margin:0; padding:0; background-color: #f7f8f9; width: 100% !important;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 700px; margin: 0 auto; padding: 4% 0;">
        <tr>
            <td class="wrapper"
                style="border-radius: 24px; box-shadow: 0 10px 30px rgba(230, 57, 70, 0.08); overflow: hidden;">
                <table width="100%" cellpadding="0" cellspacing="0" class="header-icons">
                    <tr>
                        <td align="center">
                            <table cellpadding="0" cellspacing="0" class="social">
                                <tr>
                                    <td><a href="https://www.facebook.com/seindotravel/" target="_blank"><img
                                                src="{{ asset('assets/icons/white-facebook.png') }}"
                                                alt="facebook" /></a></td>
                                    <td><a href="https://wa.link/f3s2f7" target="_blank"><img
                                                src="{{ asset('assets/icons/white-whatsapp.png') }}"
                                                alt="whatsapp" /></a></td>
                                    <td><a href="https://www.youtube.com/@seindotourtravel5864" target="_blank"><img
                                                src="{{ asset('assets/icons/white-youtube.png') }}"
                                                alt="youtube" /></a></td>
                                    <td><a href="https://www.instagram.com/seindotravel/" target="_blank"><img
                                                src="{{ asset('assets/icons/white-instagram.png') }}"
                                                alt="instagram" /></a></td>
                                    <td><a href="https://id.linkedin.com/company/seindo-travel" target="_blank"><img
                                                src="{{ asset('assets/icons/white-linkedin.png') }}"
                                                alt="linkedin" /></a></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <table width="100%" cellpadding="0" cellspacing="0" class="logo-section">
                    <tr>
                        <td align="center">
                            <img src="{{ asset('assets/images/logo.svg') }}" alt="{{ config('app.name') }}" />
                        </td>
                    </tr>
                </table>

                <table width="100%" cellpadding="0" cellspacing="0" class="hero-banner">
                    <tr>
                        <td align="center">
                            <img src="{{ asset('assets/images/email-banner.webp') }}" alt="Liburan Tanpa Batas" />
                        </td>
                    </tr>
                </table>

                <table width="100%" cellpadding="0" cellspacing="0" class="content-section">
                    <tr>
                        <td align="center">
                            @yield('title')

                            @yield('content')
                        </td>
                    </tr>
                </table>

                <table width="100%" cellpadding="0" cellspacing="0" class="features"
                    style="padding: 15px 30px 45px 30px;">
                    <tr>
                        <td class="feature-col">
                            <table cellpadding="0" cellspacing="0" class="feature-card">
                                <tr>
                                    <td align="center">
                                        <img src="{{ asset('assets/images/select-a-destination.png') }}"
                                            alt="Select a destination" />
                                        <h3>Pilih Destinasi</h3>
                                        <p>Tentukan tujuan wisata favorit dari pilihan menarik.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>

                        <td class="feature-col">
                            <table cellpadding="0" cellspacing="0" class="feature-card">
                                <tr>
                                    <td align="center">
                                        <img src="{{ asset('assets/images/easy-booking.png') }}" alt="Easy Booking" />
                                        <h3>Booking Mudah</h3>
                                        <p>Proses pemesanan cepat, aman, dan tanpa ribet.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>

                        <td class="feature-col">
                            <table cellpadding="0" cellspacing="0" class="feature-card">
                                <tr>
                                    <td align="center">
                                        <img src="{{ asset('assets/images/heading-off-on-vacation.png') }}"
                                            alt="Heading Off on Vacation" />
                                        <h3>Berangkat</h3>
                                        <p>Kami siapkan segalanya, Anda tinggal menikmati.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <table width="100%" cellpadding="0" cellspacing="0" class="footer">
                    <tr>
                        <td align="center">
                            <p>
                                <strong>{{ config('app.name') }}</strong><br />
                                Komplek Cemara Asri, Jl. Boulevard Timur No.28 AI-AJ Medan <br />
                                Estate, Kec, Percut Sei Tuan Kabupaten Deli Serdang,<br />
                                Sumatera Utara 20371, Indonesia<br />
                            </p>
                            <p>

                                <a href="https://wa.link/f3s2f7" target="_blank">+62 812-1010-3588</a> | <a
                                    href="mailto:sales@seindotravel.com"
                                    target="_blank">sales@seindotravel.com</a><br />
                                <a href="https://www.seindotravel.com/" target="_blank">www.seindotravel.com</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
