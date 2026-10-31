<?php

if (!function_exists('helperReplaceSeparator')) {
    function helperReplaceSeparator(string $value, string $from = '/', string $to = '-'): string
    {
        return str_replace($from, $to, $value);
    }
}

if (!function_exists('helperMonthNumbersToRomanNumerals')) {
    function helperMonthNumbersToRomanNumerals($number)
    {
        $numerals = [
            1 => 'I',
            2 => 'II',
            3 => 'III',
            4 => 'IV',
            5 => 'V',
            6 => 'VI',
            7 => 'VII',
            8 => 'VIII',
            9 => 'IX',
            10 => 'X',
            11 => 'XI',
            12 => 'XII'
        ];

        return $numerals[$number] ?? 'I';
    }
}

if (!function_exists('helperIndonesianDateformat')) {
    function helperIndonesianDateformat($date)
    {
        $bulan = array(
            1 => 'Januari',
            'Februari',
            'Maret',
            'April',
            'Mei',
            'Juni',
            'Juli',
            'Agustus',
            'September',
            'Oktober',
            'November',
            'Desember'
        );

        // Mengambil bagian dari date
        $dateSplit = explode('-', $date);

        // Format: date [1] adalah bulan
        return $dateSplit[2] . ' ' . $bulan[(int)$dateSplit[1]] . ' ' . $dateSplit[0];
    }
}

if (!function_exists('helperImageNotFound')) {
    function helperImageNotFound()
    {
        return 'img/image-not-found.png';
    }
}

if (!function_exists('helperIsJson')) {
    function helperIsJson($string)
    {
        json_decode($string);
        return (json_last_error() == JSON_ERROR_NONE);
    }
}

if (!function_exists('helperIsOnlyNumbers')) {
    function helperIsOnlyNumbers($string)
    {
        return preg_match('/^\d+$/', $string) === 1;
    }
}

if (!function_exists('helperSpelledOutIndonesiannumbers')) {
    function helperSpelledOutIndonesiannumbers($number)
    {
        $number = abs($number);
        $numeral = array("", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas");

        if ($number < 12) {
            return $numeral[$number];
        } elseif ($number < 20) {
            return helperSpelledOutIndonesiannumbers($number - 10) . " belas ";
        } elseif ($number < 100) {
            return helperSpelledOutIndonesiannumbers($number / 10) . " puluh " . helperSpelledOutIndonesiannumbers($number % 10);
        } elseif ($number < 200) {
            return "seratus " . helperSpelledOutIndonesiannumbers($number - 100);
        } elseif ($number < 1000) {
            return helperSpelledOutIndonesiannumbers($number / 100) . " ratus " . helperSpelledOutIndonesiannumbers($number % 100);
        } elseif ($number < 2000) {
            return "seribu " . helperSpelledOutIndonesiannumbers($number - 1000);
        } elseif ($number < 1000000) {
            return helperSpelledOutIndonesiannumbers($number / 1000) . " ribu " . helperSpelledOutIndonesiannumbers($number % 1000);
        } elseif ($number < 1000000000) {
            return helperSpelledOutIndonesiannumbers($number / 1000000) . " juta " . helperSpelledOutIndonesiannumbers($number % 1000000);
        } elseif ($number < 1000000000000) {
            return helperSpelledOutIndonesiannumbers($number / 1000000000) . " miliar " . helperSpelledOutIndonesiannumbers($number % 1000000000);
        } elseif ($number < 1000000000000000) {
            return helperSpelledOutIndonesiannumbers($number / 1000000000000) . " triliun " . helperSpelledOutIndonesiannumbers($number % 1000000000000);
        } elseif ($number < 1000000000000000000) {
            return helperSpelledOutIndonesiannumbers($number / 1000000000000000) . " kuadriliun " . helperSpelledOutIndonesiannumbers($number % 1000000000000000);
        } elseif ($number < 1000000000000000000000) {
            return helperSpelledOutIndonesiannumbers($number / 1000000000000000000) . " kuintiliun " . helperSpelledOutIndonesiannumbers($number % 1000000000000000000);
        } elseif ($number < 1000000000000000000000000) {
            return helperSpelledOutIndonesiannumbers($number / 1000000000000000000000) . " sekstiliun " . helperSpelledOutIndonesiannumbers($number % 1000000000000000000000);
        } elseif ($number < 1000000000000000000000000000) {
            return helperSpelledOutIndonesiannumbers($number / 1000000000000000000000000) . " septiliun " . helperSpelledOutIndonesiannumbers($number % 1000000000000000000000000);
        } elseif ($number < 1000000000000000000000000000000) {
            return helperSpelledOutIndonesiannumbers($number / 1000000000000000000000000000) . " oktiliun " . helperSpelledOutIndonesiannumbers($number % 1000000000000000000000000000);
        } elseif ($number < 1000000000000000000000000000000000) {
            return helperSpelledOutIndonesiannumbers($number / 1000000000000000000000000000000) . " noniliun " . helperSpelledOutIndonesiannumbers($number % 1000000000000000000000000000000);
        } elseif ($number < 1000000000000000000000000000000000000) {
            return helperSpelledOutIndonesiannumbers($number / 1000000000000000000000000000000000) . " desiliun " . helperSpelledOutIndonesiannumbers($number % 1000000000000000000000000000000000);
        } else {
            return "error";
        }
    }
}
