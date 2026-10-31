<?php

namespace App\Services\Systems;

use App\Models\OrderProductAttribute;
use Carbon\Carbon;

class CodeGenerator
{
    public static function orderProductAttribute(string $code)
    {
        $allowedToContinue = false;
        $number = '/' . strtoupper($code) . '-SGT/' . Carbon::now()->year;
        do {
            $thisMonthCode = helperMonthNumbersToRomanNumerals(Carbon::now()->month);
            $dObjLastTransaksi = OrderProductAttribute::where('code', 'like', "%" . $number . "%")->latest()->first();

            $dIntLastKode = 0;
            if ($dObjLastTransaksi && $dObjLastTransaksi->receipt_number) {
                $dIntLastKode = (int) intval(explode('/', $dObjLastTransaksi->receipt_number)[0]);
            }

            $dIntKodeNow = $dIntLastKode + 1;

            $dStrPrefix = '';
            if ($dIntKodeNow < 10) {
                $dStrPrefix = '000';
            } else if ($dIntKodeNow < 100) {
                $dStrPrefix = '00';
            } else if ($dIntKodeNow < 1000) {
                $dStrPrefix = '0';
            } else {
                $dStrPrefix = '';
            }

            $number = $dStrPrefix . $dIntKodeNow . "/" . $thisMonthCode . $number;

            //cek apakah udah ada
            $exists = OrderProductAttribute::where('code', $number)->first();
            if (!$exists) {
                $allowedToContinue = true;
            }
        } while (!$allowedToContinue);

        return $number;
    }
    public static function kwitansi()
    {
        // $allowedToContinue = false;
        // $number = 'KW-STB/';
        // do {
        //     $thisMonthCode = $number . date('Ym');

        //     $dObjLastTransaksi = FinanceKwitansi::where('receipt_number', 'like', "%" . $thisMonthCode . "%")->orderBy('id', 'desc')->first();

        //     $dIntLastKode = 0;
        //     if ($dObjLastTransaksi && $dObjLastTransaksi->receipt_number) {
        //         $dIntLastKode = (int) str_replace($thisMonthCode, "", $dObjLastTransaksi->receipt_number);
        //     }

        //     $dIntKodeNow = $dIntLastKode + 1;
        //     $dStrPrefix = '';
        //     if ($dIntKodeNow < 10) {
        //         $dStrPrefix = '000';
        //     } else if ($dIntKodeNow < 100) {
        //         $dStrPrefix = '00';
        //     } else if ($dIntKodeNow < 1000) {
        //         $dStrPrefix = '0';
        //     } else {
        //         $dStrPrefix = '';
        //     }

        //     $number = $thisMonthCode  . $dStrPrefix . $dIntKodeNow;

        //     //cek apakah udah ada
        //     $exists = FinanceKwitansi::where('receipt_number', $number)->first();
        //     if (!$exists) {
        //         $allowedToContinue = true;
        //     }
        // } while (!$allowedToContinue);

        // return $number;
    }
    public static function make()
    {
        // $allowedToContinue = false;
        // $number = '';

        // do {
        //     $kodeHariIni = date('Ymd') . '-';

        //     $dObjLastTransaksi = Order::whereYear('created_at', date('Y'))->latest()->first();

        //     $dIntLastKode = 0;
        //     if ($dObjLastTransaksi && $dObjLastTransaksi->invoice_number) {
        //         $arrKode = explode('-', $dObjLastTransaksi->invoice_number);
        //         $dIntLastKode = (int) $arrKode[array_key_last($arrKode)];
        //     }

        //     $dIntKodeNow = $dIntLastKode + 1;
        //     $dStrPrefix = '';
        //     if ($dIntKodeNow < 10) {
        //         $dStrPrefix = '000';
        //     } else if ($dIntKodeNow < 100) {
        //         $dStrPrefix = '00';
        //     } else if ($dIntKodeNow < 1000) {
        //         $dStrPrefix = '0';
        //     } else {
        //         $dStrPrefix = '';
        //     }

        //     $number = $kodeHariIni  . $dStrPrefix . $dIntKodeNow;

        //     //cek apakah udah ada
        //     $transaksiNow = Order::where('invoice_number', $number)->first();
        //     if (!$transaksiNow) {
        //         $allowedToContinue = true;
        //     }
        // } while (!$allowedToContinue);

        // return $number;
    }
    public static function generate($kode = 'C')
    {
        // $allowedToContinue = false;
        // $number = '';

        // $typeTransaction = 'STB/' . $kode;
        // do {
        //     $kodeHariIni = $typeTransaction . date('Ymd') . '-';

        //     $dObjLastTransaksi = Order::where('invoice_number', 'like', "%" . $kodeHariIni . "%")->orderBy('id', 'desc')->first();

        //     $dIntLastKode = 0;
        //     if ($dObjLastTransaksi && $dObjLastTransaksi->invoice_number) {
        //         $dIntLastKode = (int)@end(explode('-', $dObjLastTransaksi->invoice_number));
        //     }

        //     $dIntKodeNow = $dIntLastKode + 1;
        //     $dStrPrefix = '';
        //     if ($dIntKodeNow < 10) {
        //         $dStrPrefix = '000';
        //     } else if ($dIntKodeNow < 100) {
        //         $dStrPrefix = '00';
        //     } else if ($dIntKodeNow < 1000) {
        //         $dStrPrefix = '0';
        //     } else {
        //         $dStrPrefix = '';
        //     }

        //     $number = $kodeHariIni . rand(1000, 9999) . '-' . $dStrPrefix . $dIntKodeNow;

        //     //cek apakah udah ada
        //     $transaksiNow = Order::where('invoice_number', $number)->first();
        //     if (!$transaksiNow) {
        //         $allowedToContinue = true;
        //     }
        // } while (!$allowedToContinue);

        // return $number;
    }
}
