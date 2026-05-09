"use client";

import { useState, useMemo, useCallback } from "react";
import type { SystemConfig } from "@/types/system";

// ===== TYPES =====

/** Alias for SystemConfig — kept for backward compatibility */
export type SystemConfigGeneral = SystemConfig;

export interface SystemConfigCacheData {
  data: SystemConfigGeneral;
  timestamp: number;
  ttl: number;
}

// ===== CONSTANTS =====

export const CACHE_TTL = 60 * 60 * 1000; // 1 giờ
const CACHE_KEY_PREFIX = "SystemConfig-cache";

// ===== STORAGE HELPERS =====

const getStorageKey = (group: string) =>
  group === "general" ? CACHE_KEY_PREFIX : `${CACHE_KEY_PREFIX}:${group}`;

export const isCacheExpired = (timestamp: number): boolean => {
  return Date.now() - timestamp > CACHE_TTL;
};

const getCacheFromStorage = (group: string): SystemConfigCacheData | null => {
  if (typeof window === "undefined") return null;

  try {
    const cached = localStorage.getItem(getStorageKey(group));
    if (!cached) return null;

    const parsedCache: SystemConfigCacheData = JSON.parse(cached);

    // Kiểm tra cache có hết hạn không
    if (isCacheExpired(parsedCache.timestamp)) {
      localStorage.removeItem(getStorageKey(group));
      return null;
    }

    return parsedCache;
  } catch (error) {
    localStorage.removeItem(getStorageKey(group));
    return null;
  }
};

const saveCacheToStorage = (
  group: string,
  cache: SystemConfigCacheData
): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(getStorageKey(group), JSON.stringify(cache));
  } catch (error) {
    // Error saving cache to localStorage
  }
};

const clearCacheFromStorage = (group: string): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(getStorageKey(group));
  } catch (error) {
    // Error clearing cache from localStorage
  }
};

// ===== HOOK =====

export interface UseSystemConfigCacheOptions {
  group: string;
  enableCache: boolean;
}

export interface UseSystemConfigCacheResult {
  cache: SystemConfigCacheData | null;
  isCacheValid: boolean;
  setCache: React.Dispatch<React.SetStateAction<SystemConfigCacheData | null>>;
  saveToCache: (configData: SystemConfigGeneral) => void;
  loadFromStorage: () => SystemConfigCacheData | null;
  clearCache: () => void;
}

/**
 * Hook xử lý TTL caching logic (memory + localStorage) cho system config
 */
export function useSystemConfigCache(
  options: UseSystemConfigCacheOptions
): UseSystemConfigCacheResult {
  const { group, enableCache } = options;

  const [cache, setCache] = useState<SystemConfigCacheData | null>(null);

  const isCacheValid = useMemo(() => {
    if (!enableCache || !cache) return false;
    return !isCacheExpired(cache.timestamp);
  }, [enableCache, cache]);

  const saveToCache = useCallback(
    (configData: SystemConfigGeneral): void => {
      if (!enableCache) return;

      const cacheData: SystemConfigCacheData = {
        data: configData,
        timestamp: Date.now(),
        ttl: CACHE_TTL,
      };

      setCache(cacheData);
      saveCacheToStorage(group, cacheData);
    },
    [enableCache, group]
  );

  const loadFromStorage = useCallback((): SystemConfigCacheData | null => {
    if (typeof window === "undefined") return null;
    return getCacheFromStorage(group);
  }, [group]);

  const clearCache = useCallback((): void => {
    setCache(null);
    clearCacheFromStorage(group);
  }, [group]);

  return {
    cache,
    isCacheValid,
    setCache,
    saveToCache,
    loadFromStorage,
    clearCache,
  };
}
