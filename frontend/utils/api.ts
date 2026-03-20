import axios, { InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: "https://terratrust-3.onrender.com/api",
});

// Add a request interceptor to add the auth token to headers
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
