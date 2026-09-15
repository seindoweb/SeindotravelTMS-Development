export type Paginate<T> = {
    data: T[];
    links: {
        url: string | null;
        label: string;
        page?: number | null;
        active: boolean;
    }[];
    current_page: number;
    firts_page_url?: string;
    from: number;
    last_page: number;
    last_page_url?: string;
    next_page_url?: string;
    path?: string;
    per_page: number;
    prev_page_url?: string;
    to: number;
    total: number;
};

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        roles: string[] | undefined;
        user: UserProps;
    };
};

export interface CountryProps {
    key?: string;
    id: number;
    name: string;
    iso3: string | null;
    numeric_code: string | null;
    iso2: string | null;
    phonecode: string | null;
    capital: string | null;
    currency: string | null;
    currency_name: string | null;
    currency_symbol: string | null;
    tld: string | null;
    native: string | null;
    population: number | null;
    gdp: string | null;
    tld: string | null;
    region: string | null;
    region_id: number | null;
    subregion: string | null;
    subregion_id: number | null;
    nationality: string | null;
    area_sq_km: number | null;
    postal_code_format: string | null;
    postal_code_regex: string | null;
    timezones: string | null;
    translations: string | null;
    latitude: string | null;
    longitude: string | null;
    emoji: string | null;
    emojiU: string | null;
    flag: string | null;
    wikiDataId: string | null;
}

export interface StateProps {
    key?: string;
    id: number;
    name: string;
    country_id: number | null;
    country_code: string | null;
    fips_code: string | null;
    iso2: string | null;
    iso3166_2: string | null;
    type: string | null;
    level: number | null;
    parent_id: number | null;
    native: string | null;
    latitude: string | null;
    longitude: string | null;
    timezone: string | null;
    translations: string | null;
    flag: string | null;
    wikiDataId: string | null;
    population: number | null;
    countries: CountryProps | null;
}

export interface CityProps {
    id: number;
    index: string;
    key: string;
    name: string;
    state_id: number | null;
    state_code: string | null;
    country_id: number | null;
    country_code: string | null;
    type: string | null;
    level: number | null;
    parent_id: number | null;
    latitude: string | null;
    longitude: string | null;
    native: string | null;
    population: number | null;
    timezone: string | null;
    translations: string | null;
    flag: string | null;
    wikiDataId: string | null;
    states?: StateProps | null;
}

export interface RegionProps {
    key?: string;
    id: number;
    name: string;
    translations: string | null;
    flag: string | null;
    wikiDataId: string | null;
}

export interface SubregionProps {
    key?: string;
    id: number;
    name: string;
    translations: string | null;
    region_id: number | null;
    flag: string | null;
    wikiDataId: string | null;
    regions?: RegionProps | null;
}

export interface UserProps {
    index: string;
    key: string;

    title?: string;
    full_name: string;

    email: string;
    email_verified_at?: string;

    dial_code?: string;
    phone_number?: string;

    identity_type?: string;
    identity_number?: string;

    gender?: string;
    place_of_birth?: string;
    date_of_birth?: string;

    tracking_code?: string;

    has_credit: boolean;
    is_agent: boolean;

    upline_id?: number;

    country_id?: number;
    state_id?: number;
    city_id?: number;

    countries?: CountryProps;
    states?: StateProps;
    cities?: CityProps;

    address?: string;
    zip_code?: string;

    locale?: string;
    currency?: string;

    password_reset_otp_expires_at?: string;

    lang?: string;
    default_currency?: string;
    profile_photo_path?: string;

    active: boolean;

    upline?: UserProps;
    user_credits?: UserCreditProps | null;
    created_by?: number;
    updated_by?: number;

    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}

export interface UserCreditProps {
    index: string;
    key: string;
    user_id: number;
    balance: number;
    currency: string;
    is_active: boolean;

    created_at?: string;
    updated_at?: string;
    created_by?: number;
    updated_by?: number;
}

export interface UserCreditTransactionProps {
    index: string;
    key: string;
    type: string;
    user_credit_id: number;
    amount: number;
    used_before: number;
    used_after: number;
    source: string | null;
    reference_type: string | null;
    reference_id: number | null;
    description: string | null;

    created_at: string;
    updated_at: string;
    created_by: number | null;
    updated_by: number | null;
}

export interface HotelProps {
    id: number;
    code: string;
    hotelCode: string;
    name: string;
    rating: number;
}

export interface DestinationProps {
    key: number;
    code: string;
    name: string;
    destinationCode: string;
    countryISO2: string;
    score: number;
    matchType: string;
}

export interface RoomGuestProps {
    adults: number;
    children: number;
    childAges: number[];
    extraBed: boolean;
}
