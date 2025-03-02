import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_BASE_API
// export const API_BASE_URL = "http://localhost:5000/api/v1"
// export const API_BASE_URL = "https://pizza-ordering-service-5ygp.vercel.app/api/v1"

export default axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export const axiosPrivate = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

