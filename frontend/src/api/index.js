// axiosInstance.js
import axios from "axios";


const api = axios.create({
    baseURL: "http://localhost:3000",
});

// Middleware that adds token to every request.
api.interceptors.request.use(
    (config) => {
        if (config.skipAuth) {
            return config;
        }

        const token = sessionStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
