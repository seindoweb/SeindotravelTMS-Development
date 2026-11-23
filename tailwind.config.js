import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.{js,ts,jsx,tsx}',
    ],
    safelist: [
        {
            pattern: /^(bg|text|border|ring)-order-/,
        },
    ],

    theme: {
        extend: {
            backgroundImage: {
                'pattern-lines': "url('/assets/images/pattern-lines.png')",
                'panel-headers': "url('/assets/images/panel-header-background.svg')",
                'blue-checkered': "url('/assets/images/blue-checkered-background.webp')",
            },
            colors: {
                primary: {
                    DEFAULT: "#1E293B",
                    dark: "#0F172A",
                    bright: "#334155",
                },
                secondary: {
                    DEFAULT: "#F8FAFC",
                    dark: "#F1F5F9",
                    bright: "#FFFFFF",
                },
                tertiary: {
                    DEFAULT: "#EB2D34",
                    dark: "#7F141C",
                    bright: "#f7b7b9",
                },
                quaternary: {
                    DEFAULT: "#64748B",
                    dark: "#475569",
                    bright: "#94A3B8",
                },
                // Global Order Status Colors based on order_product_attributes (B, P, C, D, A, F, E, X)
                order: {
                    b: {
                        DEFAULT: "#F59E0B",
                        light: "#FEF3C7",
                        dark: "#B45309",
                        border: "#FDE68A",
                    },
                    p: {
                        DEFAULT: "#0EA5E9",
                        light: "#E0F2FE",
                        dark: "#0369A1",
                        border: "#BAE6FD",
                    },
                    c: {
                        DEFAULT: "#3B82F6",
                        light: "#DBEAFE",
                        dark: "#1D4ED8",
                        border: "#BFDBFE",
                    },
                    d: {
                        DEFAULT: "#10B981",
                        light: "#D1FAE5",
                        dark: "#065F46",
                        border: "#A7F3D0",
                    },
                    a: {
                        DEFAULT: "#8B5CF6",
                        light: "#EDE9FE",
                        dark: "#6D28D9",
                        border: "#DDD6FE",
                    },
                    f: {
                        DEFAULT: "#EF4444",
                        light: "#FEE2E2",
                        dark: "#991B1B",
                        border: "#FECDD3",
                    },
                    e: {
                        DEFAULT: "#64748B",
                        light: "#F1F5F9",
                        dark: "#334155",
                        border: "#CBD5E1",
                    },
                    x: {
                        DEFAULT: "#F43F5E",
                        light: "#FFE4E6",
                        dark: "#9F1239",
                        border: "#FECACA",
                    },
                    booking: {
                        DEFAULT: "#F59E0B",
                        light: "#FEF3C7",
                        dark: "#B45309",
                        border: "#FDE68A",
                    },
                    progress: {
                        DEFAULT: "#0EA5E9",
                        light: "#E0F2FE",
                        dark: "#0369A1",
                        border: "#BAE6FD",
                    },
                    confirmed: {
                        DEFAULT: "#3B82F6",
                        light: "#DBEAFE",
                        dark: "#1D4ED8",
                        border: "#BFDBFE",
                    },
                    done: {
                        DEFAULT: "#10B981",
                        light: "#D1FAE5",
                        dark: "#065F46",
                        border: "#A7F3D0",
                    },
                    aborted: {
                        DEFAULT: "#8B5CF6",
                        light: "#EDE9FE",
                        dark: "#6D28D9",
                        border: "#DDD6FE",
                    },
                    failed: {
                        DEFAULT: "#EF4444",
                        light: "#FEE2E2",
                        dark: "#991B1B",
                        border: "#FECDD3",
                    },
                    expired: {
                        DEFAULT: "#64748B",
                        light: "#F1F5F9",
                        dark: "#334155",
                        border: "#CBD5E1",
                    },
                    canceled: {
                        DEFAULT: "#F43F5E",
                        light: "#FFE4E6",
                        dark: "#9F1239",
                        border: "#FECACA",
                    },
                },
            },
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
        },
    },

    plugins: [forms],
};
