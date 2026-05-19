// ===== CENTRALIZED LOCALSTORAGE SERVICE =====
// Wraps all localStorage operations with SSR safety, type-safety, and JSON handling.

import type { User } from "@/lib/store/authTypes";

// ===== HELPERS =====

const isBrowser = typeof window !== "undefined";

/** Safe JSON parse with fallback */
function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

/** Safe localStorage.getItem (SSR-safe) */
function getItem(key: string): string | null {
  if (!isBrowser) return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Safe localStorage.setItem (SSR-safe) */
function setItem(key: string, value: string): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage full or unavailable
  }
}

/** Safe localStorage.removeItem (SSR-safe) */
function removeItem(key: string): void {
  if (!isBrowser) return;
  try {
    localStorage.removeItem(key);
  } catch {
    // localStorage unavailable
  }
}

// ===== KEY CONSTANTS =====

const KEYS = {
  AUTH_TOKEN: "auth_token",
  USER: "user",
  USER_PERMISSIONS: "userPermissions",
  REFRESH_TOKEN: "refreshToken",
  SYSTEM_CONFIG_PREFIX: "SystemConfig-cache",
} as const;

// ===== STORAGE SERVICE =====

export const storage = {
  // --- Auth ---
  auth: {
    getToken(): string | null {
      return getItem(KEYS.AUTH_TOKEN);
    },
    setToken(token: string): void {
      setItem(KEYS.AUTH_TOKEN, token);
    },
    clearToken(): void {
      removeItem(KEYS.AUTH_TOKEN);
    },
    getRefreshToken(): string | null {
      return getItem(KEYS.REFRESH_TOKEN);
    },
    setRefreshToken(token: string): void {
      setItem(KEYS.REFRESH_TOKEN, token);
    },
    clearRefreshToken(): void {
      removeItem(KEYS.REFRESH_TOKEN);
    },
  },

  // --- User ---
  user: {
    getData(): User | null {
      return safeParse<User | null>(getItem(KEYS.USER), null);
    },
    setData(user: User): void {
      setItem(KEYS.USER, JSON.stringify(user));
    },
    clearData(): void {
      removeItem(KEYS.USER);
    },
    getPermissions(): string[] {
      return safeParse<string[]>(getItem(KEYS.USER_PERMISSIONS), []);
    },
    setPermissions(permissions: string[]): void {
      setItem(KEYS.USER_PERMISSIONS, JSON.stringify(permissions));
    },
    clearPermissions(): void {
      removeItem(KEYS.USER_PERMISSIONS);
    },
  },

  // --- System Config cache ---
  config: {
    getCache(group: string): string | null {
      const key = group === "general" ? KEYS.SYSTEM_CONFIG_PREFIX : `${KEYS.SYSTEM_CONFIG_PREFIX}:${group}`;
      return getItem(key);
    },
    setCache(group: string, value: string): void {
      const key = group === "general" ? KEYS.SYSTEM_CONFIG_PREFIX : `${KEYS.SYSTEM_CONFIG_PREFIX}:${group}`;
      setItem(key, value);
    },
    clearCache(group: string): void {
      const key = group === "general" ? KEYS.SYSTEM_CONFIG_PREFIX : `${KEYS.SYSTEM_CONFIG_PREFIX}:${group}`;
      removeItem(key);
    },
  },

  // --- Clear all app data ---
  clearAll(): void {
    storage.auth.clearToken();
    storage.auth.clearRefreshToken();
    storage.user.clearData();
    storage.user.clearPermissions();
  },
} as const;

/** Exported key constants for advanced usage */
export { KEYS as STORAGE_KEYS };
