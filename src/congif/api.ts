import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(original));
      }
      isRefreshing = true;
      try {
        const refreshRes = await api.get("/auth/refresh");
        isRefreshing = false;
        processQueue(null, null);
        return api(original);
      } catch (refreshErr) {
        isRefreshing = false;
        processQueue(refreshErr, null);
        localStorage.removeItem("user");
        window.location.href = "/login";

        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(err);
  }
);
