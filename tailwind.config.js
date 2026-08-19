import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
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
            },
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
        },
    },

    plugins: [forms],
};
