<?php

namespace App\Http\Middleware;

use App\Services\Systems\ResponseFormatter;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiAccessToken
{
    /**
     * validate
     *
     * @param  mixed $token
     * @return void
     */
    private function validate($token)
    {
        $data = [
            [
                'for' => 'WEB SEINDOTRAVEL',
                'token' => 'S31NDO-GL0B4L-TR4VEL-W3BS1T3',
            ],
            [
                'for' => 'MOBILE SEINDOTRAVEL',
                'token' => 'S31NDO-GL0B4L-TR4VEL-M0B1L3',
            ],
            [
                // 'for' => 'PARTNER SEINDOTRAVEL',
                // 'token' => '!SEINDOPARNERSHIP',
            ],
        ];

        $tokens = array_column($data, 'token');

        return in_array($token, $tokens, true);
    }

    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $prefixXendit = config('app.url') . "/api/xendit/";
        $prefixCdn = config('app.url') . "/api/cdn/";

        if (strpos($request->url(), $prefixXendit) === 0) {
            // URL starts with the specified prefix
            return $next($request);
        } else if (strpos($request->url(), $prefixCdn) === 0) {
            // URL starts with the specified prefix
            return $next($request);
        } else {
            // URL does not start with the specified prefix
            if (!self::validate($request->header('Tms-Access-Token'))) {
                return response('', 404);
            }
        }


        return $next($request);
    }
}
