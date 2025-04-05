// axiosInstance.js
import axios from "axios";

import {getSavedToken} from "./auth.js";


const api = axios.create({
    baseURL: "/api",
});

// Middleware that adds token to every request.
api.interceptors.request.use(
    (config) => {
        if (config.skipAuth) {
            return config;
        }

        const token = getSavedToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
