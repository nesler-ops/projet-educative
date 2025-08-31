// frontend/src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",

  // withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // o donde lo guardes
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`; // MUY importante el prefijo Bearer
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // Token inválido o expirado: limpia sesión y manda a login
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("user_type");
      localStorage.removeItem("user_id");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
