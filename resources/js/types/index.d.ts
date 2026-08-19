export interface User {
    id: number;
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

    referral_code?: string;

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

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
