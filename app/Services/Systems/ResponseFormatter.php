<?php

namespace App\Services\Systems;

/**
 * Format response.
 */
class ResponseFormatter
{
    public const StatusContinue           = 100; // RFC 9110, 15.2.1
    public const StatusSwitchingProtocols = 101; // RFC 9110, 15.2.2
    public const StatusProcessing         = 102; // RFC 2518, 10.1
    public const StatusEarlyHints         = 103; // RFC 8297

    public const StatusOK                   = 200; // RFC 9110, 15.3.1
    public const StatusCreated              = 201; // RFC 9110, 15.3.2
    public const StatusAccepted             = 202; // RFC 9110, 15.3.3
    public const StatusNonAuthoritativeInfo = 203; // RFC 9110, 15.3.4
    public const StatusNoContent            = 204; // RFC 9110, 15.3.5
    public const StatusResetContent         = 205; // RFC 9110, 15.3.6
    public const StatusPartialContent       = 206; // RFC 9110, 15.3.7
    public const StatusMultiStatus          = 207; // RFC 4918, 11.1
    public const StatusAlreadyReported      = 208; // RFC 5842, 7.1
    public const StatusIMUsed               = 226; // RFC 3229, 10.4.1


    public const StatusMultipleChoices   = 300; // RFC 9110, 15.4.1
    public const StatusMovedPermanently  = 301; // RFC 9110, 15.4.2
    public const StatusFound             = 302; // RFC 9110, 15.4.3
    public const StatusSeeOther          = 303; // RFC 9110, 15.4.4
    public const StatusNotModified       = 304; // RFC 9110, 15.4.5
    public const StatusUseProxy          = 305; // RFC 9110, 15.4.6
    public const _                       = 306; // RFC 9110, 15.4.7 (Unused)
    public const StatusTemporaryRedirect = 307; // RFC 9110, 15.4.8
    public const StatusPermanentRedirect = 308; // RFC 9110, 15.4.9


    public const StatusBadRequest                   = 400; // RFC 9110, 15.5.1
    public const StatusUnauthorized                 = 401; // RFC 9110, 15.5.2
    public const StatusPaymentRequired              = 402; // RFC 9110, 15.5.3
    public const StatusForbidden                    = 403; // RFC 9110, 15.5.4
    public const StatusNotFound                     = 404; // RFC 9110, 15.5.5
    public const StatusMethodNotAllowed             = 405; // RFC 9110, 15.5.6
    public const StatusNotAcceptable                = 406; // RFC 9110, 15.5.7
    public const StatusProxyAuthRequired            = 407; // RFC 9110, 15.5.8
    public const StatusRequestTimeout               = 408; // RFC 9110, 15.5.9
    public const StatusConflict                     = 409; // RFC 9110, 15.5.10
    public const StatusGone                         = 410; // RFC 9110, 15.5.11
    public const StatusLengthRequired               = 411; // RFC 9110, 15.5.12
    public const StatusPreconditionFailed           = 412; // RFC 9110, 15.5.13
    public const StatusRequestEntityTooLarge        = 413; // RFC 9110, 15.5.14
    public const StatusRequestURITooLong            = 414; // RFC 9110, 15.5.15
    public const StatusUnsupportedMediaType         = 415; // RFC 9110, 15.5.16
    public const StatusRequestedRangeNotSatisfiable = 416; // RFC 9110, 15.5.17
    public const StatusExpectationFailed            = 417; // RFC 9110, 15.5.18
    public const StatusTeapot                       = 418; // RFC 9110, 15.5.19 (Unused)
    public const StatusMisdirectedRequest           = 421; // RFC 9110, 15.5.20
    public const StatusUnprocessableEntity          = 422; // RFC 9110, 15.5.21
    public const StatusLocked                       = 423; // RFC 4918, 11.3
    public const StatusFailedDependency             = 424; // RFC 4918, 11.4
    public const StatusTooEarly                     = 425; // RFC 8470, 5.2.
    public const StatusUpgradeRequired              = 426; // RFC 9110, 15.5.22
    public const StatusPreconditionRequired         = 428; // RFC 6585, 3
    public const StatusTooManyRequests              = 429; // RFC 6585, 4
    public const StatusRequestHeaderFieldsTooLarge  = 431; // RFC 6585, 5
    public const StatusUnavailableForLegalReasons   = 451; // RFC 7725, 3


    public const StatusInternalServerError           = 500; // RFC 9110, 15.6.1
    public const StatusNotImplemented                = 501; // RFC 9110, 15.6.2
    public const StatusBadGateway                    = 502; // RFC 9110, 15.6.3
    public const StatusServiceUnavailable            = 503; // RFC 9110, 15.6.4
    public const StatusGatewayTimeout                = 504; // RFC 9110, 15.6.5
    public const StatusHTTPVersionNotSupported       = 505; // RFC 9110, 15.6.6
    public const StatusVariantAlsoNegotiates         = 506; // RFC 2295, 8.1
    public const StatusInsufficientStorage           = 507; // RFC 4918, 11.5
    public const StatusLoopDetected                  = 508; // RFC 5842, 7.2
    public const StatusNotExtended                   = 510; // RFC 2774, 7
    public const StatusNetworkAuthenticationRequired = 511; // RFC 6585, 6

    /**
     * API Response
     *
     * @var array
     */
    protected static $response = [
        'meta' => [
            'code' => 200,
            'status' => 'success',
            'message' => null,
        ],
        'data' => null,
    ];

    /**
     * Give success response.
     */
    public static function success($data = null, $message = null)
    {
        self::$response['meta']['message'] =  $message ?? self::statusText(self::$response['meta']['code']);
        self::$response['data'] = $data;

        return response()->json(self::$response, self::$response['meta']['code']);
    }

    /**
     * Give error response.
     */
    public static function error($data = null, $message = null, $code = 400)
    {
        self::$response['meta']['status'] = 'error';
        self::$response['meta']['code'] = $code;
        self::$response['meta']['message'] =  $message ?? self::statusText($code);
        self::$response['data'] = $data;

        return response()->json(self::$response, self::$response['meta']['code']);
    }

    /**
     * StatusText returns a text for the HTTP status code.
     * It returns the empty
     * string if the code is unknown.
     */
    public static function statusText(int $code)
    {
        switch ($code) {
            case self::StatusContinue:
                return "Continue";
            case self::StatusSwitchingProtocols:
                return "Switching Protocols";
            case self::StatusProcessing:
                return "Processing";
            case self::StatusEarlyHints:
                return "Early Hints";
            case self::StatusOK:
                return "OK";
            case self::StatusCreated:
                return "Created";
            case self::StatusAccepted:
                return "Accepted";
            case self::StatusNonAuthoritativeInfo:
                return "Non-Authoritative Information";
            case self::StatusNoContent:
                return "No Content";
            case self::StatusResetContent:
                return "Reset Content";
            case self::StatusPartialContent:
                return "Partial Content";
            case self::StatusMultiStatus:
                return "Multi-Status";
            case self::StatusAlreadyReported:
                return "Already Reported";
            case self::StatusIMUsed:
                return "IM Used";
            case self::StatusMultipleChoices:
                return "Multiple Choices";
            case self::StatusMovedPermanently:
                return "Moved Permanently";
            case self::StatusFound:
                return "Found";
            case self::StatusSeeOther:
                return "See Other";
            case self::StatusNotModified:
                return "Not Modified";
            case self::StatusUseProxy:
                return "Use Proxy";
            case self::StatusTemporaryRedirect:
                return "Temporary Redirect";
            case self::StatusPermanentRedirect:
                return "Permanent Redirect";
            case self::StatusBadRequest:
                return "Bad Request";
            case self::StatusUnauthorized:
                return "Unauthorized";
            case self::StatusPaymentRequired:
                return "Payment Required";
            case self::StatusForbidden:
                return "Forbidden";
            case self::StatusNotFound:
                return "Not Found";
            case self::StatusMethodNotAllowed:
                return "Method Not Allowed";
            case self::StatusNotAcceptable:
                return "Not Acceptable";
            case self::StatusProxyAuthRequired:
                return "Proxy Authentication Required";
            case self::StatusRequestTimeout:
                return "Request Timeout";
            case self::StatusConflict:
                return "Conflict";
            case self::StatusGone:
                return "Gone";
            case self::StatusLengthRequired:
                return "Length Required";
            case self::StatusPreconditionFailed:
                return "Precondition Failed";
            case self::StatusRequestEntityTooLarge:
                return "Request Entity Too Large";
            case self::StatusRequestURITooLong:
                return "Request URI Too Long";
            case self::StatusUnsupportedMediaType:
                return "Unsupported Media Type";
            case self::StatusRequestedRangeNotSatisfiable:
                return "Requested Range Not Satisfiable";
            case self::StatusExpectationFailed:
                return "Expectation Failed";
            case self::StatusTeapot:
                return "I'm a teapot";
            case self::StatusMisdirectedRequest:
                return "Misdirected Request";
            case self::StatusUnprocessableEntity:
                return "Unprocessable Entity";
            case self::StatusLocked:
                return "Locked";
            case self::StatusFailedDependency:
                return "Failed Dependency";
            case self::StatusTooEarly:
                return "Too Early";
            case self::StatusUpgradeRequired:
                return "Upgrade Required";
            case self::StatusPreconditionRequired:
                return "Precondition Required";
            case self::StatusTooManyRequests:
                return "Too Many Requests";
            case self::StatusRequestHeaderFieldsTooLarge:
                return "Request Header Fields Too Large";
            case self::StatusUnavailableForLegalReasons:
                return "Unavailable For Legal Reasons";
            case self::StatusInternalServerError:
                return "Internal Server Error";
            case self::StatusNotImplemented:
                return "Not Implemented";
            case self::StatusBadGateway:
                return "Bad Gateway";
            case self::StatusServiceUnavailable:
                return "Service Unavailable";
            case self::StatusGatewayTimeout:
                return "Gateway Timeout";
            case self::StatusHTTPVersionNotSupported:
                return "HTTP Version Not Supported";
            case self::StatusVariantAlsoNegotiates:
                return "Variant Also Negotiates";
            case self::StatusInsufficientStorage:
                return "Insufficient Storage";
            case self::StatusLoopDetected:
                return "Loop Detected";
            case self::StatusNotExtended:
                return "Not Extended";
            case self::StatusNetworkAuthenticationRequired:
                return "Network Authentication Required";
            default:
                return "";
        }
    }
}
