<?php

namespace App\Constants;

final class SystemConstant
{
    public const DEFAULT_LOCALE = 'id';

    public const DEFAULT_CURRENCY = 'IDR';

    public const AVAILABLE_LOCALE = ['id', 'en'];

    public const AVAILABLE_CURRENCY = ['IDR', 'USD'];

    // SYSTEM  PLATFORMS
    public const SYSTEM_PLATFORMS_TMS = 'tms';

    public const SYSTEM_PLATFORMS_WEB = 'web';

    public const SYSTEM_PLATFORMS_MOBILE = 'mobile';

    // NOTIFICATION PLATFORM
    public const NOTIFICATION_PLATFORM_CRM = 1;

    public const NOTIFICATION_PLATFORM_WEBMOBILE = 2;

    public const NOTIFICATION_PLATFORM_WEBMOBILECRM = 3;
}
