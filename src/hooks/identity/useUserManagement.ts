"use client";

import { useState, useCallback } from "react";
import apiClient from "@/lib/api/client";
import { userEndpoints } from "@/lib/api/endpoints";
import { normalizeDetailResponse } from "@/lib/api/response-normalizer";
import { useToastContext } from "@/contexts/ToastContext";
import { useAuthStore } from "@/lib/store/authStore";

export interface UserProfile {
  id: number | string;
  username: string;
  email: string;
  phone?: string;
  name?: string;
  image?: string;
  status: string;
  email_verified_at?: string | null;
  phone_verified_at?: string | null;
  last_login_at?: string | null;
  created_at: string;
  updated_at: string;
  profile?: {
    birthday?: string;
    gender?: string;
    address?: string;
    countryId?: string;
    provinceId?: string;
    wardId?: string;
    about?: string;
  };
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  image?: string;
  birthday?: string;
  gender?: string;
  address?: string;
  countryId?: string;
  provinceId?: string;
  wardId?: string;
  about?: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  password: string;
  confirmPassword: string;
}

export interface UserManagementResult {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  data?: Record<string, unknown>;
}

export function useUserManagement() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const { showSuccess, showError } = useToastContext();
  const authStore = useAuthStore();

  // Lay thong tin user hien tai
  const getCurrentUser = useCallback(async (): Promise<UserProfile | null> => {
    try {
      setLoading(true);
      const response = await apiClient.get(userEndpoints.profile.me);
      const userData = normalizeDetailResponse<UserProfile>(response.data);

      if (userData) {
        setUser(userData);
        return userData;
      } else {
        showError(response.data?.message || "Khong the lay thong tin user");
        return null;
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string; error?: string } } })?.response?.data?.error ||
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Khong the lay thong tin user";
      showError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Cap nhat thong tin user
  const updateProfile = useCallback(
    async (data: UpdateProfileData): Promise<UserManagementResult> => {
      try {
        setLoading(true);
        const response = await apiClient.patch(
          userEndpoints.profile.update,
          data
        );

        const profileData = normalizeDetailResponse<UserProfile>(response.data);

        if (response.data.success) {
          if (profileData) {
            setUser(profileData);
            authStore.setUser(profileData as any);
            await authStore.refreshUserInfo();
          }

          showSuccess(
            response.data.message || "Cap nhat thong tin thanh cong"
          );
          return {
            success: true,
            message: response.data.message || "Cap nhat thong tin thanh cong",
            data: profileData as unknown as Record<string, unknown> | undefined,
          };
        } else {
          const errorMessage =
            response.data.message || "Cap nhat thong tin that bai";
          showError(errorMessage);
          return {
            success: false,
            message: errorMessage,
            errors: response.data.errors,
          };
        }
      } catch (error: unknown) {
        const errorMessage =
          (error as { response?: { data?: { message?: string; error?: string } } })?.response?.data?.error ||
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Co loi xay ra, vui long thu lai";
        showError(errorMessage);
        return {
          success: false,
          message: errorMessage,
          errors: (error as { response?: { data?: { errors?: Record<string, string[]> } } })?.response?.data?.errors,
        };
      } finally {
        setLoading(false);
      }
    },
    [showSuccess, showError, authStore]
  );

  // Doi mat khau
  const changePassword = useCallback(
    async (data: ChangePasswordData): Promise<UserManagementResult> => {
      try {
        setLoading(true);
        const response = await apiClient.patch(
          userEndpoints.profile.changePassword,
          data
        );

        if (response.data.success) {
          showSuccess(response.data.message || "Doi mat khau thanh cong");
          return {
            success: true,
            message: response.data.message || "Doi mat khau thanh cong",
          };
        } else {
          const errorMessage =
            response.data.message || "Doi mat khau that bai";
          showError(errorMessage);
          return {
            success: false,
            message: errorMessage,
            errors: response.data.errors,
          };
        }
      } catch (error: unknown) {
        const errorMessage =
          (error as { response?: { data?: { message?: string; error?: string } } })?.response?.data?.error ||
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Co loi xay ra, vui long thu lai";
        showError(errorMessage);
        return {
          success: false,
          message: errorMessage,
          errors: (error as { response?: { data?: { errors?: Record<string, string[]> } } })?.response?.data?.errors,
        };
      } finally {
        setLoading(false);
      }
    },
    [showSuccess, showError]
  );

  // Dang xuat
  const logout = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      await authStore.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  }, [authStore]);

  return {
    loading,
    user,
    getCurrentUser,
    updateProfile,
    changePassword,
    logout,
  };
}
