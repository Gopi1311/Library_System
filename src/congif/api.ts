import axios, { AxiosError } from "axios";

export const BASE_URL = "http://localhost:5000/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ✅ Global Error Interceptor
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    let message = "Something went wrong";

    if (error instanceof AxiosError) {
      message = error.response?.data?.error || error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    // Throw message only — not Axios error object
    return Promise.reject(new Error(message));
  }
);
