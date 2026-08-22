<!DOCTYPE html>
<html>

<head>
    <style>
        @import url("https://fonts.googleapis.com/css?family=Outfit:300,400,600,700&display=swap");

        * {
            margin: 0;
            border: 0;
            padding: 0;
        }

        body {
            font-family: "Outfit", "Lato", "sans-serif";
            background-color: #f7f8f9;
            font-size: 16px;
            max-width: 700px;
            margin: 0 auto;
            padding: 4% 0;
            color: #4a4a4a;
            width: 100% !important;
        }

        .wrapper {
            background-color: #ffffff;
            border-radius: 24px;
            overflow: hidden;
            margin: 0;
            padding: 0;
        }

        /* icon sosmed */
        .social {
            width: 98%;
            text-align: center;
            list-style-type: none;
            padding: 1%;
        }

        .social li {
            display: inline;
        }

        .social img {
            max-width: 32px;
            margin-right: 3px;
            margin-left: 3px;
        }

        img {
            max-width: 100%;
        }

        /* Header */
        .header-icons {
            background-color: #E63946;
            padding: 12px;
            text-align: center;
            min-height: 24px;
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
        .hero-banner {
            position: relative;
        }

        .hero-banner img {
            width: 100%;
            display: block;
        }

        /* Konten */
        .otp-box {
            background-color: #fff9f9;
            border: 2px dashed #E63946;
            border-radius: 12px;
            padding: 20px;
            margin: 25px auto;
            max-width: 300px;
        }

        .otp-code {
            font-size: 36px;
            font-weight: 700;
            color: #E63946;
            letter-spacing: 5px;
        }

        .content-section {
            padding: 20px 30px 20px 30px;
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

        /* Tombol */
        .btn-container {
            margin: 35px 0;
        }

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
            display: table;
            width: 100%;
            padding: 15px 30px 45px 30px;
            box-sizing: border-box;
        }

        .feature-col {
            display: table-cell;
            width: 33.33%;
            text-align: center;
            padding: 0 10px;
            vertical-align: top;
        }

        .feature-card {
            background-color: #ffffff;
            border: 1px solid #f9ecec;
            border-radius: 18px;
            padding: 25px 15px;
            box-shadow: 0 5px 15px rgba(230, 57, 70, 0.04);
            height: 100%;
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
        }

        .feature-card img {
            max-width: 55px;
        }

        /* Footer */
        .footer {
            background-color: #E63946;
            color: #ffffff;
            text-align: center;
            padding: 35px 20px;
            font-size: 14px;
            line-height: 1.8;
            box-shadow: 0 1px 3px 0 rgba(230, 57, 70, 0.1), 0 1px 2px -1px rgba(230, 57, 70, 0.1);
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
            margin: 40px 0 20px 0;
        }
    </style>
</head>

<body>
    <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
            <td align="center">
                <table class="content" width="100%" cellpadding="0" cellspacing="0" role="presentation">

                    {!! $header ?? '' !!}

                    <div class="content-section">
                        <table class="inner-body" align="center" width="570" cellpadding="0" cellspacing="0"
                            role="presentation">
                            <!-- Body content -->
                            <tr>
                                <td class="content-cell">
                                    {!! Illuminate\Mail\Markdown::parse($slot) !!}

                                    {!! $subcopy ?? '' !!}
                                </td>
                            </tr>
                        </table>
                    </div>

                    <div class="features">
                        <div class="feature-col">
                            <div class="feature-card">
                                <img src="{{ asset('assets/images/select-a-destination.png') }}"
                                    alt="Select a destination" />
                                <h3>Pilih Destinasi</h3>
                                <p>Tentukan tujuan wisata favorit dari pilihan menarik.</p>
                            </div>
                        </div>
                        <div class="feature-col">
                            <div class="feature-card">
                                <img src="{{ asset('assets/images/easy-booking.png') }}" alt="Easy Booking" />
                                <h3>Booking Mudah</h3>
                                <p>Proses pemesanan cepat, aman, dan tanpa ribet.</p>
                            </div>
                        </div>
                        <div class="feature-col">
                            <div class="feature-card">
                                <img src="{{ asset('assets/images/heading-off-on-vacation.png') }}"
                                    alt="Heading Off on Vacation" />
                                <h3>Berangkat</h3>
                                <p>Kami siapkan segalanya, Anda tinggal menikmati.</p>
                            </div>
                        </div>
                    </div>

                    {!! $footer ?? '' !!}
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
