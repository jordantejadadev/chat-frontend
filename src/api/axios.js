import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

api.interceptors.request.use(
  (config) => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      const user = JSON.parse(savedUser);

      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

export default api;
