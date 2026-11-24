<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">

    <title>Invoice</title>

    @vite('resources/css/app.css')
</head>

<body class="bg-white text-slate-800">

    <div class="max-w-4xl p-10 mx-auto">

        <div class="flex items-center justify-between pb-6 border-b">
            <div>
                <h1 class="text-2xl font-bold text-slate-900">
                    <img src="{{ $data['content']['logo'] }}" />
                </h1>
                <p class="text-sm text-slate-500">
                    Travel Management System
                </p>
            </div>

            <div class="text-right">
                <h2 class="text-3xl font-bold text-slate-900">
                    INVOICE
                </h2>
                <p class="text-sm text-slate-500">
                    INV-2026-0001
                </p>
            </div>
        </div>

        <div class="mt-8">
            <h3 class="text-sm font-semibold uppercase text-slate-500">
                Invoice Details
            </h3>

            <table class="w-full mt-4 text-sm">
                <thead class="bg-slate-100">
                    <tr>
                        <th class="p-3 text-left">Description</th>
                        <th class="p-3 text-right">Amount</th>
                    </tr>
                </thead>

                <tbody>
                    <tr class="border-b">
                        <td class="p-3">Hotel Booking</td>
                        <td class="p-3 text-right">1,500,000</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="mt-8 text-right">
            <p class="text-sm text-slate-500">Grand Total</p>
            <p class="text-2xl font-bold text-slate-900">
                IDR 1,500,000
            </p>
        </div>

    </div>

</body>

</html>
