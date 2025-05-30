import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import {defineConfig} from "vite";


// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    server: {
        proxy: {
            "/api/": {
                target: "http://localhost:3000/",
                changeOrigin: true,
            },
            "/socket.io/": {
                target: "http://localhost:3000/socket.io/",
                changeOrigin: true,
            },
        },
    },
});
