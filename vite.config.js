import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react'

export default defineConfig({
    server: {
        host: 'tms.seindotravel.local',
        port: 5173,
        cors: true,
        hmr: {
            host: 'tms.seindotravel.local',
        },
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
        }),
        react(),
    ],
});
