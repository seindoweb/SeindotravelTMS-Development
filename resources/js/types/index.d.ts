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
        user: UserProps;
    };
};

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

    address?: string;
    zip_code?: string;

    password_reset_otp_expires_at?: string;

    lang?: string;
    default_currency?: string;
    profile_photo_path?: string;

    active: boolean;

    created_by?: number;
    updated_by?: number;

    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}
