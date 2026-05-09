import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AxiosError } from "axios";
import apiClient from "@/lib/api/client";
import { userEndpoints } from "@/lib/api/endpoints";
import { setTokenToCookie, clearTokenFromCookie, getTokenFromCookie } from "@/lib/api/utils";
import { initializeUserGroups } from "@/lib/group/utils";
import { storage } from "@/lib/storage";
import type { User, LoginCredentials, RegisterData, ResetPasswordData, AuthResult, AuthState, AuthActions } from "./authTypes";
import { EMPTY_AUTH_STATE } from "./authTypes";

// Re-export types cho backward compatibility
export type { User, LoginCredentials, RegisterData, ResetPasswordData, AuthResult, AuthState, AuthActions };

const FETCH_CACHE_DURATION = 30000; // 30 giay

/** Xoa user data khoi localStorage */
function clearLocalUserData() {
  storage.user.clearData();
  storage.user.clearPermissions();
}

/** Xoa tat ca auth + group data khoi localStorage & cookies */
function clearAllLocalData() {
  clearLocalUserData();
  storage.auth.clearRefreshToken();
  storage.group.clearGroups();
  storage.group.clearSelected();
  clearTokenFromCookie("group_id");
}

/** Luu user data vao localStorage */
function persistUserData(user: User) {
  storage.user.setData(user);
  storage.user.setPermissions(user.permissions || []);
}

/** Extract user state tu API user object */
function userToState(user: User) {
  return {
    user,
    userRole: user.role || "user",
    userPermissions: user.permissions || [],
    isAuthenticated: true,
  };
}

type ApiError = AxiosError<{ message?: string; error?: string; errors?: Record<string, string[]> }>;

/** Xu ly error response thanh AuthResult */
function handleAuthError(error: unknown, defaultMessage: string): AuthResult {
  const e = error as ApiError;
  if (e.response?.status === 401) {
    return { success: false, message: e.response?.data?.error || e.response?.data?.message || "Email hoac mat khau khong chinh xac." };
  }
  if (e.response?.status === 403) {
    return { success: false, message: e.response?.data?.error || "Tai khoan bi khoa. Vui long thu lai sau 30 phut." };
  }
  if (e.response?.status === 429) {
    return { success: false, message: "Ban da gui qua nhieu yeu cau. Vui long doi va thu lai." };
  }
  if (e.response?.status === 409) {
    return { success: false, message: e.response?.data?.error || "Tai khoan da ton tai.", errors: e.response?.data?.errors };
  }
  if (e.response?.status === 400 || e.response?.status === 422) {
    return { success: false, message: e.response?.data?.error || e.response?.data?.message || "Du lieu khong hop le", errors: e.response?.data?.errors };
  }
  if (e.code === "ECONNABORTED") {
    return { success: false, message: "Ket noi bi timeout, vui long thu lai" };
  }
  if (!e.response) {
    return { success: false, message: "Khong the ket noi den server" };
  }
  return { success: false, message: e.response?.data?.error || e.response?.data?.message || defaultMessage };
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // State
      ...EMPTY_AUTH_STATE,
      isFetchingUser: false,
      lastFetchTime: 0,
      isInitialized: false,

      // Permission methods
      can: (permission: string): boolean => {
        const { userPermissions } = get();
        if (!userPermissions || !Array.isArray(userPermissions)) return false;
        return userPermissions.includes(permission);
      },

      canAny: (permissions: string[]): boolean => {
        if (!Array.isArray(permissions)) return false;
        return permissions.some((p) => get().can(p));
      },

      canAll: (permissions: string[]): boolean => {
        if (!Array.isArray(permissions)) return false;
        return permissions.every((p) => get().can(p));
      },

      // Auth Actions
      login: async (credentials: LoginCredentials): Promise<AuthResult> => {
        try {
          const response = await apiClient.post(userEndpoints.auth.login, credentials);

          if (response.data.success) {
            const { token, refreshToken, expiresIn } = response.data.data || {};

            // Save access token to cookie + localStorage
            if (token) {
              const days = credentials.remember ? 30 : 7;
              setTokenToCookie(token, "auth_token", days);
              storage.auth.setToken(token);
            }

            // Save refresh token to storage
            if (refreshToken) {
              storage.auth.setRefreshToken(refreshToken);
            }

            set({ isAuthenticated: true });

            // Fetch user info from /api/auth/me — pass token explicitly since the
            // cookie may not be readable yet in the same tick (cross-origin request).
            if (token) {
              try {
                const meResponse = await apiClient.get(userEndpoints.profile.me, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                if (meResponse.data.success && meResponse.data.data) {
                  const user = meResponse.data.data;
                  set(userToState(user));
                  persistUserData(user);
                }
              } catch {
                // Token is valid but couldn't fetch user info - still authenticated
              }
            }

            // Clear old group data
            storage.group.clearGroups();
            storage.group.clearSelected();
            clearTokenFromCookie("group_id");

            return { success: true, data: response.data.data, message: response.data.message };
          }

          return { success: false, message: response.data.message || response.data.error || "Dang nhap that bai" };
        } catch (error: unknown) {
          return handleAuthError(error, "Loi ket noi");
        }
      },

      register: async (data: RegisterData): Promise<AuthResult> => {
        try {
          const response = await apiClient.post(userEndpoints.auth.register, data);

          if (response.data.success || response.status === 201) {
            return { success: true, data: response.data.data, message: response.data.message || "Dang ky thanh cong." };
          }

          return { success: false, message: response.data.message || "Dang ky that bai", errors: response.data.errors };
        } catch (error: unknown) {
          return handleAuthError(error, "Loi ket noi");
        }
      },

      sendOtpRegister: async (email: string): Promise<AuthResult> => {
        try {
          const response = await apiClient.post(userEndpoints.auth.sendOtpRegister, { email });
          return { success: true, message: response.data.data?.message || response.data.message || "Ma OTP da duoc gui den email cua ban." };
        } catch (error: unknown) {
          const e = error as ApiError;
          return {
            success: false,
            message: e.response?.data?.error || e.response?.data?.message || "Khong the gui OTP. Vui long thu lai sau.",
            errors: e.response?.data?.errors,
          };
        }
      },

      sendOtpForgotPassword: async (email: string): Promise<AuthResult> => {
        try {
          const response = await apiClient.post(userEndpoints.auth.sendOtpForgotPassword, { email });
          return { success: true, message: response.data.data?.message || response.data.message || "Ma OTP da duoc gui den email cua ban." };
        } catch (error: unknown) {
          const e = error as ApiError;
          return {
            success: false,
            message: e.response?.data?.error || e.response?.data?.message || "Email khong ton tai hoac loi server.",
            errors: e.response?.data?.errors,
          };
        }
      },

      resetPassword: async (data: ResetPasswordData): Promise<AuthResult> => {
        try {
          const response = await apiClient.post(userEndpoints.auth.resetPassword, data);
          return { success: true, message: response.data.message || "Doi mat khau thanh cong." };
        } catch (error: unknown) {
          const e = error as ApiError;
          return {
            success: false,
            message: e.response?.data?.error || e.response?.data?.message || "Ma OTP sai hoac het han.",
            errors: e.response?.data?.errors,
          };
        }
      },

      logout: async (): Promise<void> => {
        try {
          const refreshToken = storage.auth.getRefreshToken();
          await apiClient.post(userEndpoints.auth.logout, { refreshToken });
        } catch {
          // Ignore logout errors
        }

        set({ ...EMPTY_AUTH_STATE, lastFetchTime: 0 });
        clearTokenFromCookie();
        clearAllLocalData();
      },

      fetchUserInfo: async (force: boolean = false): Promise<void> => {
        try {
          set({ isFetchingUser: true });

          const token = getTokenFromCookie();
          if (!token) {
            set(EMPTY_AUTH_STATE);
            return;
          }

          const response = await apiClient.get(userEndpoints.profile.me);

          if (response.data.success && response.data.data) {
            const user = response.data.data;
            set({ ...userToState(user), lastFetchTime: Date.now() });
            persistUserData(user);
          } else {
            set(EMPTY_AUTH_STATE);
            clearTokenFromCookie();
          }
        } catch (error: unknown) {
          const e = error as ApiError;
          if (e.response?.status === 401 || e.response?.status === 403) {
            set(EMPTY_AUTH_STATE);
            if (e.response?.status === 401) clearTokenFromCookie();
            clearLocalUserData();
          }
        } finally {
          set({ isFetchingUser: false });
        }
      },

      checkAuth: async (): Promise<boolean> => {
        set({ isInitialized: true });

        const token = getTokenFromCookie();
        if (!token) {
          set(EMPTY_AUTH_STATE);
          return false;
        }

        const { isAuthenticated, user, lastFetchTime } = get();
        if (isAuthenticated && user && Date.now() - lastFetchTime < FETCH_CACHE_DURATION) {
          return true;
        }

        await get().fetchUserInfo();
        return get().isAuthenticated;
      },

      refreshUserInfo: async (): Promise<void> => {
        await get().fetchUserInfo(true);
      },

      refreshToken: async (): Promise<AuthResult> => {
        try {
          const currentRefreshToken = storage.auth.getRefreshToken();
          const response = await apiClient.post(userEndpoints.auth.refresh, {
            refreshToken: currentRefreshToken,
          });

          if (response.data.success && response.data.data?.token) {
            setTokenToCookie(response.data.data.token);
            storage.auth.setToken(response.data.data.token);
            if (response.data.data.refreshToken) {
              storage.auth.setRefreshToken(response.data.data.refreshToken);
            }
            return { success: true, data: response.data.data, message: "Lam moi token thanh cong." };
          }

          return { success: false, message: response.data.message || "Lam moi token that bai" };
        } catch (error: unknown) {
          const e = error as ApiError;
          if (e.response?.status === 401) {
            await get().logout();
            return { success: false, message: "Phien dang nhap da het han, vui long dang nhap lai" };
          }
          return { success: false, message: "Loi khi lam moi token" };
        }
      },

      initFromStorage: async (): Promise<boolean> => {
        if (typeof window === "undefined") return false;

        const token = getTokenFromCookie();
        const storedUser = storage.user.getData();
        const storedPermissions = storage.user.getPermissions();

        if (token && storedUser) {
          try {
            const response = await apiClient.get(userEndpoints.profile.me);

            if (response.data.success) {
              const user = response.data.data;
              set(userToState(user));
              persistUserData(user);
              return true;
            }

            get().clearAuthState();
            return false;
          } catch {
            // Fallback: dung data tu localStorage neu API fail
            if (storedUser) {
              set({
                ...userToState(storedUser),
                userPermissions: storedPermissions,
              });
              return true;
            }

            get().clearAuthState();
            return false;
          }
        }

        if (storedUser) {
          get().clearAuthState();
          return false;
        }

        return false;
      },

      clearAuthState: (): void => {
        set(EMPTY_AUTH_STATE);
        clearTokenFromCookie();
        clearAllLocalData();
      },

      setUser: (user: User): void => {
        set(userToState(user));
        persistUserData(user);
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        userRole: state.userRole,
        userPermissions: state.userPermissions,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
