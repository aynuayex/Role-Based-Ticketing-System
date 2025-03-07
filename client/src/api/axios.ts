import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_BASE_API

export default axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export const axiosPrivate = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

