<?php

namespace App\Services\Systems;

use InvalidArgumentException;

/**
 * TriadIdMask
 *
 * Used to mask a numeric ID into a custom code.
 *
 * Encoding pattern:
 * - The number is processed in groups of 3 digits.
 * - Hundreds use the `cn` mapping.
 * - Tens use the `cr` mapping.
 * - Ones use the `cv` mapping.
 *
 * Examples:
 * 1     => 0-x-a
 * 8     => 0-x-oo
 * 500   => 5-x-uu
 * 1000  => a-0-x-uu
 * 1256  => a-2-v-ii
 * 9999  => u-9-ix-u
 * 82642 => viii-aa-6-iv-aa
 *
 * Usage:
 *
 * Encode an ID:
 * $code = TriadIdMask::encode(1256);
 * // Result: a-2-v-ii
 *
 * Decode a code:
 * $id = TriadIdMask::decode('a-2-v-ii');
 * // Result: 1256
 *
 *
 * Note:
 * This is not high-security encryption. It is only ID masking/obfuscation.
 * Always use authorization checks to prevent users from accessing data
 * that does not belong to them.
 */
class TriadIdMask
{
    private static array $cn = [
        1 => 'i',
        2 => 'z',
        3 => 'e',
        4 => 'a',
        5 => 's',
        6 => 'b',
        7 => 't',
        8 => 'x',
        9 => 'g',
        0 => 'o',
    ];

    private static array $cr = [
        1 => 'i',
        2 => 'ii',
        3 => 'iii',
        4 => 'iv',
        5 => 'v',
        6 => 'vi',
        7 => 'vii',
        8 => 'viii',
        9 => 'ix',
        0 => 'x',
    ];

    private static array $cv = [
        1 => 'a',
        2 => 'aa',
        3 => 'e',
        4 => 'ee',
        5 => 'i',
        6 => 'ii',
        7 => 'o',
        8 => 'oo',
        9 => 'u',
        0 => 'uu',
    ];

    /**
     * encode
     *
     * @param  mixed $number
     * @return string
     */
    public static function encode(int $number): string
    {
        if ($number < 0) {
            throw new InvalidArgumentException('Angka tidak boleh negatif.');
        }

        $stringNumber = (string) $number;

        if ($number <= 999) {
            return self::encodeLastGroup((int) $number);
        }

        $groups = str_split(str_pad($stringNumber, ceil(strlen($stringNumber) / 3) * 3, '0', STR_PAD_LEFT), 3);

        $result = [];

        foreach ($groups as $index => $group) {
            $groupNumber = (int) $group;

            if ($index === 0) {
                $result[] = self::encodeLeadingGroup($groupNumber);
            } else {
                $result[] = self::encodeLastGroup($groupNumber);
            }
        }

        return implode('-', array_filter($result));
    }

    /**
     * encodeLeadingGroup
     *
     * @param  mixed $number
     * @return string
     */
    private static function encodeLeadingGroup(int $number): string
    {
        if ($number <= 9) {
            return self::$cv[$number];
        }

        if ($number <= 99) {
            $tens = intdiv($number, 10);
            $ones = $number % 10;

            return self::$cr[$tens] . '-' . self::$cv[$ones];
        }

        return self::encodeLastGroup($number);
    }

    /**
     * encodeLastGroup
     *
     * @param  mixed $number
     * @return string
     */
    private static function encodeLastGroup(int $number): string
    {
        $number = str_pad((string) $number, 3, '0', STR_PAD_LEFT);

        $hundreds = (int) $number[0];
        $tens = (int) $number[1];
        $ones = (int) $number[2];

        return self::$cn[$hundreds] . '-' . self::$cr[$tens] . '-' . self::$cv[$ones];
    }

    /**
     * decode
     *
     * @param  mixed $code
     * @return int
     */
    public static function decode(string $code): int
    {
        $parts = explode('-', $code);

        if (count($parts) < 3) {
            return self::decodeLeadingGroup($parts);
        }

        $lastThreeParts = array_slice($parts, -3);
        $beforeParts = array_slice($parts, 0, -3);

        $groups = [];

        if (!empty($beforeParts)) {
            $remaining = count($beforeParts) % 3;

            if ($remaining === 0) {
                $remaining = 3;
            }

            $firstGroup = array_slice($beforeParts, 0, $remaining);
            $groups[] = self::decodeLeadingGroup($firstGroup);

            $rest = array_slice($beforeParts, $remaining);

            foreach (array_chunk($rest, 3) as $chunk) {
                $groups[] = self::decodeLastGroup($chunk);
            }
        }

        $groups[] = self::decodeLastGroup($lastThreeParts);

        $numberString = '';

        foreach ($groups as $index => $group) {
            if ($index === 0) {
                $numberString .= (string) $group;
            } else {
                $numberString .= str_pad((string) $group, 3, '0', STR_PAD_LEFT);
            }
        }

        return (int) $numberString;
    }

    /**
     * decodeLeadingGroup
     *
     * @param  mixed $parts
     * @return int
     */
    private static function decodeLeadingGroup(array $parts): int
    {
        if (count($parts) === 1) {
            return self::decodeByMap($parts[0], self::$cv);
        }

        if (count($parts) === 2) {
            $tens = self::decodeByMap($parts[0], self::$cr);
            $ones = self::decodeByMap($parts[1], self::$cv);

            return ($tens * 10) + $ones;
        }

        if (count($parts) === 3) {
            return self::decodeLastGroup($parts);
        }

        throw new InvalidArgumentException('Format kode tidak valid.');
    }

    /**
     * decodeLastGroup
     *
     * @param  mixed $parts
     * @return int
     */
    private static function decodeLastGroup(array $parts): int
    {
        if (count($parts) !== 3) {
            throw new InvalidArgumentException('Format grup harus 3 bagian.');
        }

        $hundreds = self::decodeByMap($parts[0], self::$cn);
        $tens = self::decodeByMap($parts[1], self::$cr);
        $ones = self::decodeByMap($parts[2], self::$cv);

        return ($hundreds * 100) + ($tens * 10) + $ones;
    }

    /**
     * decodeByMap
     *
     * @param  mixed $value
     * @param  mixed $map
     * @return int
     */
    private static function decodeByMap(string $value, array $map): int
    {
        $result = array_search($value, $map, true);

        if ($result === false) {
            throw new InvalidArgumentException("Kode tidak valid: {$value}");
        }

        return (int) $result;
    }
}
