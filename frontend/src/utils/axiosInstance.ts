import axios from "axios";
import {BASE_URL} from "./constants";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the token in the Authorization header
axiosInstance.interceptors.request.use(
    (config) => {
        // Retrieve the access token from localStorage
        const accessToken = localStorage.getItem('token');
        if (accessToken) {
            // Set the Authorization header with the Bearer token
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        // Handle request errors
        return Promise.reject(error);
    }
);

export default axiosInstance;