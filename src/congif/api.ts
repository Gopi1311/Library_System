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
  (error) => {
    if (axios.isAxiosError(error)) {
      const backendMessage =
        error.response?.data?.message ||  // backend message
        error.response?.data?.error ||    // fallback if you send {error:""}
        error.message;                    // axios default message

      return Promise.reject({
        message: backendMessage,
        status: error.response?.status || 500,
      });
    }

    return Promise.reject(error);
  }
);
