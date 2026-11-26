<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-Voucher Hotel - {{ $data['hotel']['name'] ?? 'Booking' }} ({{ $data['order']['code'] ?? '' }})</title>

    <style>
        /* Base Reset & Typography */
        *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background-color: #f1f5f9;
            color: #1e293b;
            font-size: 12px;
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        /* Top Action Bar (Browser Preview Only) */
        .preview-topbar {
            position: sticky;
            top: 0;
            z-index: 50;
            background: #0f172a;
            color: #ffffff;
            padding: 10px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #334155;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .topbar-left {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .topbar-status {
            font-size: 11px;
            font-weight: 700;
            padding: 3px 10px;
            border-radius: 4px;
            background: #059669;
            color: #ffffff;
            letter-spacing: 0.04em;
            text-transform: uppercase;
        }

        .topbar-code {
            font-size: 13px;
            color: #94a3b8;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-weight: 600;
        }

        .topbar-actions {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .topbar-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 14px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.15s ease-in-out;
            border: none;
        }

        .btn-back {
            background: transparent;
            color: #cbd5e1;
            border: 1px solid #475569;
        }

        .btn-back:hover {
            background: #1e293b;
            color: #ffffff;
        }

        .btn-print {
            background: #ffffff;
            color: #0f172a;
        }

        .btn-print:hover {
            background: #f8fafc;
        }

        .btn-download {
            background: #EB2E34;
            color: #ffffff;
        }

        .btn-download:hover {
            background: #d42228;
        }

        /* Printable Voucher Canvas */
        .voucher-canvas {
            max-width: 800px;
            margin: 28px auto 48px auto;
            background: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
            overflow: hidden;
        }

        .voucher-body {
            padding: 36px 40px;
        }

        /* Document Header */
        .doc-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            padding-bottom: 20px;
            border-bottom: 2px solid #0f172a;
        }

        .brand-block img {
            max-height: 44px;
            width: auto;
            display: block;
        }

        .brand-caption {
            font-size: 10px;
            font-weight: 600;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin-top: 4px;
        }

        .header-meta {
            text-align: right;
        }

        .doc-main-title {
            font-size: 18px;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: 0.02em;
            text-transform: uppercase;
        }

        .doc-sub-title {
            font-size: 11px;
            font-weight: 500;
            color: #64748b;
            margin-top: 2px;
        }

        .doc-badge-status {
            display: inline-block;
            margin-top: 6px;
            padding: 2px 10px;
            font-size: 10px;
            font-weight: 800;
            border-radius: 4px;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            border: 1px solid;
        }

        /* Booking Reference Data Table */
        .ref-table-wrap {
            margin-top: 20px;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            background: #f8fafc;
        }

        .ref-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
        }

        .ref-item {
            padding: 12px 16px;
            border-right: 1px solid #e2e8f0;
        }

        .ref-item:last-child {
            border-right: none;
        }

        .ref-label {
            display: block;
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
            color: #64748b;
            letter-spacing: 0.05em;
            margin-bottom: 3px;
        }

        .ref-value {
            display: block;
            font-size: 13px;
            font-weight: 700;
            color: #0f172a;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }

        .ref-value.text-lead {
            font-family: inherit;
            font-size: 12px;
            font-weight: 700;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .ref-value.accent {
            color: #0369a1;
        }

        /* Main Section Container */
        .section-block {
            margin-top: 22px;
        }

        .section-head {
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: #0f172a;
            padding-bottom: 6px;
            border-bottom: 1px solid #cbd5e1;
            margin-bottom: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .section-head-sub {
            font-size: 10px;
            color: #64748b;
            font-weight: 500;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }

        /* Hotel & Schedule Block */
        .hotel-schedule-row {
            display: grid;
            grid-template-columns: 1.4fr 1fr;
            gap: 16px;
            align-items: stretch;
        }

        .hotel-details {
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            padding: 14px 16px;
            background: #ffffff;
        }

        .hotel-name {
            font-size: 15px;
            font-weight: 800;
            color: #0f172a;
            line-height: 1.3;
        }

        .hotel-rating {
            margin-top: 2px;
            color: #d97706;
            font-size: 12px;
        }

        .hotel-rating-text {
            color: #64748b;
            font-size: 10px;
            font-weight: 600;
            margin-left: 4px;
        }

        .hotel-address {
            margin-top: 8px;
            font-size: 11px;
            color: #475569;
            line-height: 1.45;
        }

        .hotel-phone {
            margin-top: 6px;
            font-size: 11px;
            color: #64748b;
            font-weight: 600;
        }

        /* Schedule Card */
        .schedule-details {
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            background: #f8fafc;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .schedule-top {
            display: grid;
            grid-template-columns: 1fr 1fr;
            border-bottom: 1px solid #e2e8f0;
        }

        .schedule-box {
            padding: 12px 14px;
        }

        .schedule-box:first-child {
            border-right: 1px solid #e2e8f0;
        }

        .schedule-label {
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
            color: #64748b;
            letter-spacing: 0.05em;
            margin-bottom: 2px;
        }

        .schedule-date {
            font-size: 12px;
            font-weight: 800;
            color: #0f172a;
        }

        .schedule-time {
            font-size: 10px;
            color: #059669;
            font-weight: 600;
            margin-top: 2px;
        }

        .schedule-bottom {
            padding: 8px 14px;
            background: #ffffff;
            font-size: 11px;
            font-weight: 700;
            color: #334155;
            text-align: center;
        }

        /* Room & Guest Block */
        .room-specs-bar {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-bottom: none;
            padding: 10px 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 11px;
        }

        .room-specs-left {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .room-type-title {
            font-weight: 800;
            color: #0f172a;
        }

        .tag {
            font-size: 10px;
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 3px;
            text-transform: uppercase;
            letter-spacing: 0.03em;
        }

        .tag-meal {
            background: #eff6ff;
            color: #1e40af;
            border: 1px solid #bfdbfe;
        }

        .tag-policy {
            background: #f0fdf4;
            color: #166534;
            border: 1px solid #bbf7d0;
        }

        .room-specs-right {
            color: #64748b;
            font-weight: 600;
        }

        /* Standard Corporate Table */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
            border: 1px solid #e2e8f0;
        }

        .data-table th {
            background: #f1f5f9;
            color: #475569;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 9px;
            letter-spacing: 0.05em;
            padding: 8px 14px;
            border-bottom: 1px solid #cbd5e1;
            text-align: left;
        }

        .data-table td {
            padding: 8px 14px;
            border-bottom: 1px solid #e2e8f0;
            color: #1e293b;
        }

        .data-table tr:last-child td {
            border-bottom: none;
        }

        .badge-lead {
            display: inline-block;
            background: #ecfdf5;
            color: #047857;
            font-size: 9px;
            font-weight: 700;
            padding: 1px 5px;
            border-radius: 3px;
            border: 1px solid #a7f3d0;
            margin-left: 6px;
            text-transform: uppercase;
        }

        /* Two Column Lower Section (Instructions & Payment) */
        .lower-grid {
            margin-top: 22px;
            display: grid;
            grid-template-columns: 1.35fr 1fr;
            gap: 16px;
            align-items: stretch;
        }

        .card-instructions {
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            padding: 14px 16px;
            background: #ffffff;
        }

        .card-instructions-title {
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: #0f172a;
            margin-bottom: 8px;
            padding-bottom: 4px;
            border-bottom: 1px solid #f1f5f9;
        }

        .card-instructions-list {
            list-style: decimal inside;
            font-size: 11px;
            color: #475569;
            line-height: 1.55;
        }

        .card-instructions-list li {
            margin-bottom: 5px;
        }

        .card-instructions-list li:last-child {
            margin-bottom: 0;
        }

        .card-payment {
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            background: #f8fafc;
            padding: 14px 16px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .payment-title {
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: #0f172a;
            margin-bottom: 8px;
            padding-bottom: 4px;
            border-bottom: 1px solid #e2e8f0;
        }

        .payment-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
            color: #475569;
            margin-bottom: 6px;
        }

        .payment-row.total-row {
            margin-top: 10px;
            padding-top: 8px;
            border-top: 1px solid #cbd5e1;
            font-size: 12px;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 0;
        }

        .total-amount {
            font-size: 16px;
            color: #EB2E34;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-weight: 800;
        }

        .badge-payment {
            font-size: 9px;
            font-weight: 800;
            padding: 1px 6px;
            border-radius: 3px;
            border: 1px solid;
            text-transform: uppercase;
            display: inline-block;
        }

        /* Footer */
        .doc-footer {
            margin-top: 28px;
            padding-top: 16px;
            border-top: 1px solid #cbd5e1;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            font-size: 10px;
            color: #64748b;
            line-height: 1.5;
        }

        .doc-footer strong {
            color: #1e293b;
        }

        .doc-footer-right {
            text-align: right;
        }

        /* Print Settings for PDF and Browser Printing */
        @media print {
            body {
                background: #ffffff !important;
                color: #000000 !important;
            }

            .no-print,
            .preview-topbar {
                display: none !important;
            }

            .voucher-canvas {
                max-width: 100% !important;
                margin: 0 !important;
                border: none !important;
                box-shadow: none !important;
                border-radius: 0 !important;
            }

            .voucher-body {
                padding: 10mm 12mm !important;
            }

            .hotel-schedule-row,
            .ref-table-wrap,
            .lower-grid,
            .data-table,
            .section-block {
                break-inside: avoid;
                page-break-inside: avoid;
            }
        }

        @page {
            size: A4 portrait;
            margin: 8mm;
        }
    </style>
</head>

<body>
    @php
        $statusColor = $data['order']['status_color'] ?? '#1D4ED8';
        $statusBg = $data['order']['status_bg'] ?? '#DBEAFE';
        $statusBorder = $data['order']['status_border'] ?? '#BFDBFE';
        $badgeStyle = "color: {$statusColor}; background-color: {$statusBg}; border-color: {$statusBorder};";
    @endphp

    @if(empty($isPdf))
    <div class="preview-topbar no-print">
        <div class="topbar-left">
            <span class="topbar-status" style="{{ $badgeStyle }}">{{ $data['order']['status_label'] }}</span>
            <span class="topbar-code">{{ $data['order']['code'] }}</span>
        </div>

        <div class="topbar-actions">
            <button type="button" onclick="window.print()" class="topbar-btn btn-print">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                </svg>
                Cetak Voucher
            </button>
            <a href="{{ route('hotel.orders.orderDownloadPdf', $data['order']['safe_code']) }}" class="topbar-btn btn-download">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download PDF
            </a>
        </div>
    </div>
    @endif

    <div class="voucher-canvas">
        <div class="voucher-body">
            <div class="doc-header">
                <div class="brand-block">
                    <img src="{{ $data['company']['logo'] }}" alt="{{ $data['company']['name'] }}">
                    <div class="brand-caption">{{ $data['company']['tagline'] }}</div>
                </div>
                <div class="header-meta">
                    <div class="doc-main-title">Hotel Voucher</div>
                    <div class="doc-sub-title">Bukti Konfirmasi Reservasi Hotel</div>
                    <span class="doc-badge-status" style="{{ $badgeStyle }}">{{ $data['order']['status_label'] }}</span>
                </div>
            </div>

            <div class="ref-table-wrap">
                <div class="ref-grid">
                    <div class="ref-item">
                        <span class="ref-label">MG Booking Ref</span>
                        <span class="ref-value accent">{{ $data['order']['reference_id'] ?: '-' }}</span>
                    </div>
                    <div class="ref-item">
                        <span class="ref-label">Kode Reservasi TMS</span>
                        <span class="ref-value">{{ $data['order']['code'] }}</span>
                    </div>
                    <div class="ref-item">
                        <span class="ref-label">Tamu Utama (Lead)</span>
                        <span class="ref-value text-lead">{{ $data['customer']['lead_guest'] }}</span>
                    </div>
                    <div class="ref-item">
                        <span class="ref-label">Nomor Invoice</span>
                        <span class="ref-value">{{ $data['order']['invoice_number'] }}</span>
                    </div>
                </div>
            </div>

            <div class="section-block">
                <div class="section-head">
                    <span>Informasi Hotel &amp; Jadwal Menginap</span>
                    <span class="section-head-sub">ID: {{ $data['hotel']['code'] }}</span>
                </div>

                <div class="hotel-schedule-row">
                    <div class="hotel-details">
                        <div class="hotel-name">{{ $data['hotel']['name'] }}</div>
                        <div class="hotel-rating">
                            @for ($i = 0; $i < $data['hotel']['rating']; $i++)
                                ★
                            @endfor
                            <span class="hotel-rating-text">({{ $data['hotel']['rating'] }} Bintang)</span>
                        </div>
                        <p class="hotel-address">
                            {{ $data['hotel']['address'] }}
                            @if(!empty($data['hotel']['city']))
                                , {{ $data['hotel']['city'] }}
                            @endif
                            @if(!empty($data['hotel']['country']))
                                , {{ $data['hotel']['country'] }}
                            @endif
                        </p>
                        @if(!empty($data['hotel']['phone']) && $data['hotel']['phone'] !== '-')
                            <div class="hotel-phone">Telp: {{ $data['hotel']['phone'] }}</div>
                        @endif
                    </div>

                    <div class="schedule-details">
                        <div class="schedule-top">
                            <div class="schedule-box">
                                <span class="schedule-label">Check-In</span>
                                <div class="schedule-date">{{ $data['hotel']['check_in_full'] }}</div>
                                <div class="schedule-time">Mulai {{ $data['hotel']['check_in_time'] }}</div>
                            </div>
                            <div class="schedule-box">
                                <span class="schedule-label">Check-Out</span>
                                <div class="schedule-date">{{ $data['hotel']['check_out_full'] }}</div>
                                <div class="schedule-time">Sebelum {{ $data['hotel']['check_out_time'] }}</div>
                            </div>
                        </div>
                        <div class="schedule-bottom">
                            Durasi: {{ $data['hotel']['nights'] }} Malam
                        </div>
                    </div>
                </div>
            </div>

            <div class="section-block">
                <div class="section-head">
                    <span>Rincian Kamar &amp; Tamu Terdaftar</span>
                    <span class="section-head-sub">{{ $data['hotel']['total_rooms'] }} Kamar &bull; {{ $data['hotel']['total_guests'] }} Tamu</span>
                </div>

                <div class="room-specs-bar">
                    <div class="room-specs-left">
                        <span class="room-type-title">{{ $data['hotel']['room_type'] }}</span>
                        <span class="tag tag-meal">{{ $data['hotel']['meal_plan'] }}</span>
                        <span class="tag tag-policy">{{ $data['hotel']['cancellation_policy'] }}</span>
                    </div>
                    <div class="room-specs-right">
                        {{ $data['hotel']['total_adults'] }} Dewasa{{ $data['hotel']['total_children'] > 0 ? ', ' . $data['hotel']['total_children'] . ' Anak' : '' }}
                    </div>
                </div>

                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 15%;">Kamar</th>
                            <th style="width: 55%;">Nama Tamu</th>
                            <th style="width: 30%;">Tipe / Keterangan</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($data['rooms'] as $room)
                            @foreach ($room['paxes'] as $paxIndex => $pax)
                                <tr>
                                    @if ($paxIndex === 0)
                                        <td rowspan="{{ count($room['paxes']) ?: 1 }}" style="font-weight: 700; vertical-align: top; background: #fafafa; border-right: 1px solid #e2e8f0;">
                                            Kamar {{ $room['room_no'] }}
                                        </td>
                                    @endif
                                    <td>
                                        <strong>{{ $pax['full_name'] ?: 'Guest' }}</strong>
                                        @if (!empty($pax['is_lead']))
                                            <span class="badge-lead">Lead Guest</span>
                                        @endif
                                    </td>
                                    <td style="color: #64748b;">
                                        {{ !empty($pax['age']) ? $pax['age'] . ' Tahun' : 'Dewasa' }}
                                    </td>
                                </tr>
                            @endforeach
                        @endforeach
                    </tbody>
                </table>
            </div>

            <div class="lower-grid">
                <div class="card-instructions">
                    <div class="card-instructions-title">Petunjuk Penting Check-In</div>
                    <ol class="card-instructions-list">
                        @foreach ($data['terms'] as $term)
                            <li>{{ $term }}</li>
                        @endforeach
                    </ol>
                </div>

                <div class="card-payment">
                    <div>
                        <div class="payment-title">Rincian Pembayaran</div>
                        <div class="payment-row">
                            <span>Status Pembayaran</span>
                            <span class="badge-payment" style="color: {{ $data['order']['payment_status_color'] ?? '#B45309' }}; background-color: {{ $data['order']['payment_status_bg'] ?? '#FFFBEB' }}; border-color: {{ $data['order']['payment_status_border'] ?? '#FDE68A' }};">
                                {{ $data['order']['payment_status'] }}
                            </span>
                        </div>
                        <div class="payment-row">
                            <span>Metode Pembayaran</span>
                            <span style="font-weight: 600; color: #0f172a;">{{ $data['order']['payment_method'] }}</span>
                        </div>
                        <div class="payment-row">
                            <span>Nomor Invoice</span>
                            <span style="font-family: ui-monospace, monospace; font-weight: 600;">{{ $data['order']['invoice_number'] }}</span>
                        </div>
                    </div>

                    <div class="payment-row total-row">
                        <span>Total Biaya (Nett)</span>
                        <span class="total-amount">{{ $data['pricing']['formatted_total'] }}</span>
                    </div>
                </div>
            </div>

            <div class="doc-footer">
                <div>
                    <p><strong>{{ $data['company']['name'] }}</strong> &bull; {{ $data['company']['legal_name'] }}</p>
                    <p>{{ $data['company']['address'] }}</p>
                </div>
                <div class="doc-footer-right">
                     <p>Customer Support 24/7: <strong>{{ $data['company']['phone'] }}</strong></p>
                    <p>Email: {{ $data['company']['email'] }} | Website: {{ $data['company']['website'] }}</p>
                </div>
            </div>

        </div>
    </div>

</body>

</html>