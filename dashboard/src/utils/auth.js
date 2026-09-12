import axios from "axios";

const API_BASE = "http://localhost:3002";

const LOGIN_URL = "http://localhost:3000/login";

export const getToken = () => localStorage.getItem("token");
export const getUsername = () => localStorage.getItem("username") || "User";
export const isAuthenticated = () => !!getToken();

export const setSession = (token, username) => {
  if (token) localStorage.setItem("token", token);
  if (username) localStorage.setItem("username", username);
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  window.location.href = LOGIN_URL;
};


const authAxios = axios.create({ baseURL: API_BASE });

authAxios.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

authAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      logout();
    }
    return Promise.reject(error);
  }
);

export default authAxios;
