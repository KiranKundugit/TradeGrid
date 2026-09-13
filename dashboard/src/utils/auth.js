import axios from "axios";

// Set via REACT_APP_API_URL / REACT_APP_FRONTEND_URL in a .env file for
// local dev, and in Render's Static Site "Environment Variables" for
// production. CRA bakes these in at BUILD time, so changing them on Render
// requires a manual redeploy, not just a restart.
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3002";
const FRONTEND_URL =
  process.env.REACT_APP_FRONTEND_URL || "http://localhost:3000";
export const LOGIN_URL = `${FRONTEND_URL}/login`;

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

// Every dashboard component should import `authAxios` instead of plain
// axios so every request automatically carries the logged-in user's token,
// and a rejected/expired token automatically sends them back to login.
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
