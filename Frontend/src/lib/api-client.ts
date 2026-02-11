import axios from "axios"

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true
})

export const refreshClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true
});

apiClient.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      try {

        originalRequest._retry = true;
        await refreshClient.post("/user/refresh"); 
        return apiClient(originalRequest);
      } catch {
        window.location.href = "/login?expired=1";
      }
    }

    return Promise.reject(err);
  }
);