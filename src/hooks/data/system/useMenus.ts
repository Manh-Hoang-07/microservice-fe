import { useState, useCallback } from "react";
import api from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { normalizeListResponse } from "@/lib/api/response-normalizer";

export interface MenuTreeItem {
  id: number | string;
  name: string;
  code: string;
  path?: string | null;
  apiPath?: string | null;
  icon?: string | null;
  type?: string;
  status?: string;
  parentId?: number | string | null;
  sortOrder?: number;
  isPublic?: boolean;
  showInMenu?: boolean;
  requiredPermissionCode?: string | null;
  group?: string;
  children?: MenuTreeItem[];
}

export function useMenus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getMenuTree = useCallback(async (): Promise<MenuTreeItem[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<MenuTreeItem[]>(adminEndpoints.menus.tree);
      return normalizeListResponse<MenuTreeItem>(response.data);
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Không thể lấy menu tree";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserMenus = useCallback(async (params?: { flatten?: boolean }): Promise<MenuTreeItem[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<{ success: boolean; data: MenuTreeItem[] }>(adminEndpoints.userMenus.list, {
        params,
      });
      return normalizeListResponse<MenuTreeItem>(response.data);
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Không thể lấy menu người dùng";
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getMenuTree,
    getUserMenus,
  };
}



