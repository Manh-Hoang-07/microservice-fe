import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { env } from "@/config/env";
import { createLogger } from "@/lib/logger";
import { storage } from "@/lib/storage";
import { setTokenToCookie, clearTokenFromCookie } from "@/lib/api/utils";

const log = createLogger('api:client');

/**
 * Get access token from cookie or localStorage
 */
function getToken(): string | null {
  if (typeof window === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "auth_token") {
      return decodeURIComponent(value || "");
    }
  }

  return localStorage.getItem("auth_token");
}

/**
 * Get refresh token from storage
 */
function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return storage.auth.getRefreshToken();
}

/**
 * Get group ID: uu tien localStorage, fallback ve cookie
 */
function getGroupId(): string | null {
  if (typeof window === "undefined") return null;

  const storedGroupId = localStorage.getItem("selected_group_id");
  if (storedGroupId) return storedGroupId;

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "group_id") {
      return decodeURIComponent(value || "");
    }
  }

  return null;
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiUrl,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ── Refresh token state ──────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
}

// ── Request interceptor ──────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("auth_redirect");
      }
    }

    const groupId = getGroupId();
    if (groupId) {
      config.headers = config.headers || {};
      config.headers["X-Group-Id"] = String(groupId);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor with auto refresh ───────
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (!error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;

    // Handle 401: try refresh token
    if (status === 401 && originalRequest && !originalRequest._retry) {
      // Don't try to refresh if this IS the refresh request or login request
      const url = originalRequest.url || "";
      if (url.includes("/auth/refresh") || url.includes("/auth/login")) {
        return Promise.reject(error);
      }

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshTokenValue = getRefreshToken();
        const { data } = await axios.post(
          `${env.apiUrl}/api/auth/refresh`,
          { refreshToken: refreshTokenValue },
          { withCredentials: true }
        );

        if (data.success && data.data?.token) {
          const newToken = data.data.token;
          const newRefreshToken = data.data.refreshToken;

          // Save new tokens
          setTokenToCookie(newToken);
          if (newRefreshToken) {
            storage.auth.setRefreshToken(newRefreshToken);
          }

          processQueue(null, newToken);

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return apiClient(originalRequest);
        }

        // Refresh failed - logout
        processQueue(error, null);
        handleForceLogout();
        return Promise.reject(error);
      } catch (refreshError) {
        processQueue(refreshError, null);
        handleForceLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle 403 Forbidden: silent
    if (status === 403) {
      // Components handle their own errors
    }

    // Handle 500+ Server Error
    if (status >= 500) {
      log.error("Server error", error.response.data);
    }

    return Promise.reject(error);
  }
);

/**
 * Force logout: clear all tokens and redirect to login
 */
function handleForceLogout() {
  if (typeof window === "undefined") return;

  clearTokenFromCookie();
  storage.auth.clearRefreshToken();
  storage.auth.clearToken();
  storage.user.clearData();
  storage.user.clearPermissions();
  storage.group.clearSelected();
  storage.group.clearGroups();

  document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "group_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

  const path = window.location.pathname;
  const isProtectedPage = path.startsWith("/admin") || path.startsWith("/user");
  if (isProtectedPage) {
    window.location.href = "/login";
  }
}

// API methods
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config),

  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, data, config),

  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.put<T>(url, data, config),

  patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.patch<T>(url, data, config),

  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T>(url, config),
};

export default apiClient;
