# Config Service Integration Upgrade — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align all frontend API endpoints, types, and hooks with the config-service integration spec (`docs/frontend-config-integration.md`).

**Architecture:** Fix three endpoint files (`location.ts`, `menus.ts`, `systemConfig.ts`) so all config-service calls go through `/api/config/*`. Extend `src/types/system.ts` with full API types. Unify the duplicated `SystemConfigGeneral` type in the hook layer.

**Tech Stack:** TypeScript, Next.js, Axios (`src/lib/api/client.ts`)

**Design Spec:** `docs/superpowers/specs/2026-05-09-config-service-integration-design.md`

---

## File Map

| Action | File | Responsibility |
|--------|------|---------------|
| Modify | `src/types/system.ts` | Add `ApiResponse<T>`, `PaginatedMeta`, `Country`, `Province`, `Ward`, `MenuItem`, `EmailConfig`, `GeneralConfigPayload`, `ContactChannelPayload`; add `name?` to `SystemConfig` |
| Modify | `src/lib/api/endpoints/core/location.ts` | Fix all paths to `/api/config/*`; add `provincesByCountry`, `wardsByProvince` |
| Modify | `src/lib/api/endpoints/core/menus.ts` | Fix all paths to `/api/config/menus/*`; add `user` section; remove unused `restore` |
| Modify | `src/lib/api/endpoints/core/systemConfig.ts` | Fix `admin.update` path; add `updateGeneral`, `updateEmail` |
| Modify | `src/lib/api/endpoints/index.ts` | Expose `updateEmail`, user menus in backward-compat exports |
| Modify | `src/hooks/data/system/useSystemConfigCache.ts` | Replace local `SystemConfigGeneral` definition with import from `@/types/system` |
| Modify | `src/hooks/data/system/useSystemConfigFetch.ts` | Update type import to match |

---

## Task 1: Extend `src/types/system.ts`

**Files:**
- Modify: `src/types/system.ts`

- [ ] **Step 1: Replace the file content**

Replace the entire file with the following (all existing types preserved, new ones added):

```typescript
// ─── Generic API wrappers ────────────────────────────────────────────────────

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: PaginatedMeta | null;
  timestamp: string;
}

// ─── Location ────────────────────────────────────────────────────────────────

export interface Country {
  id: string;
  code: string;
  code_alpha3?: string | null;
  name: string;
  official_name?: string | null;
  phone_code?: string | null;
  currency_code?: string | null;
  flag_emoji?: string | null;
  status: 'active' | 'inactive';
}

export interface Province {
  id: string;
  code: string;
  name: string;
  type: string;
  country_id: string;
  phone_code?: string | null;
  status: 'active' | 'inactive';
  note?: string | null;
  code_bnv?: string | null;
  code_tms?: string | null;
}

export interface Ward {
  id: string;
  province_id: string;
  code: string;
  name: string;
  type: string;
  status: 'active' | 'inactive';
}

// ─── Menu ────────────────────────────────────────────────────────────────────

/** Minimal shape used in navigation trees (public/user menus) */
export interface Menu {
  id: number;
  code: string;
  name: string;
  path: string;
  icon: string;
  type: 'route' | 'group' | 'link';
  children: Menu[];
}

/** Full shape returned by admin endpoints */
export interface MenuItem {
  id: string;
  code: string;
  name: string;
  path?: string | null;
  api_path?: string | null;
  icon?: string | null;
  type: 'route' | 'group' | 'link';
  status: 'active' | 'inactive';
  parent_id?: string | null;
  sort_order: number;
  is_public: boolean;
  show_in_menu: boolean;
  required_permission_code?: string | null;
  group?: string | null;
  children?: MenuItem[];
}

// ─── System Config ───────────────────────────────────────────────────────────

export interface ContactChannel {
  type: string;
  value: string;
  label?: string;
  icon?: string;
  url_template?: string;
  enabled: boolean;
  sort_order?: number;
}

/** GET /api/config/general response — snake_case from DB */
export interface SystemConfig {
  [key: string]: unknown;
  id?: string;
  /** Mapped convenience alias for site_name */
  name?: string;
  site_name?: string;
  site_description?: string | null;
  site_logo?: string | null;
  site_favicon?: string | null;
  site_email?: string | null;
  site_phone?: string | null;
  site_address?: string | null;
  site_country_id?: string | null;
  site_province_id?: string | null;
  site_ward_id?: string | null;
  site_copyright?: string | null;
  timezone?: string;
  locale?: string;
  currency?: string;
  contact_channels?: ContactChannel[];
  meta_title?: string | null;
  meta_keywords?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  canonical_url?: string | null;
  google_analytics_id?: string | null;
  google_search_console?: string | null;
  facebook_pixel_id?: string | null;
  twitter_site?: string | null;
  created_at?: string;
  updated_at?: string;
}

// ─── Payloads (camelCase — request bodies) ───────────────────────────────────

export interface ContactChannelPayload {
  type: string;
  value: string;
  enabled: boolean;
  label?: string;
  icon?: string;
  urlTemplate?: string;
  sortOrder?: number;
}

/** PUT /api/config/config/general */
export interface GeneralConfigPayload {
  siteName?: string;
  siteDescription?: string;
  siteLogo?: string;
  siteFavicon?: string;
  siteEmail?: string;
  sitePhone?: string;
  siteAddress?: string;
  siteCountryId?: string;
  siteProvinceId?: string;
  siteWardId?: string;
  siteCopyright?: string;
  timezone?: string;
  locale?: string;
  currency?: string;
  contactChannels?: ContactChannelPayload[];
  metaTitle?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  googleAnalyticsId?: string;
  googleSearchConsole?: string;
  facebookPixelId?: string;
  twitterSite?: string;
}

/** PUT /api/config/config/email */
export interface EmailConfig {
  smtpHost?: string;
  smtpPort?: number;
  smtpSecure?: boolean;
  smtpUsername?: string;
  /** Send "******" to keep existing password */
  smtpPassword?: string;
  fromEmail?: string;
  fromName?: string;
  replyToEmail?: string;
}

// ─── Other ───────────────────────────────────────────────────────────────────

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  phone: string;
}

export interface ContactResponse {
  id: string;
  name: string;
  email: string;
  message: string;
  phone: string;
  status: string;
  createdAt: string;
}

export interface ContentTemplate {
  id: string;
  code: string;
  name: string;
  category: 'render' | 'file';
  type: 'email' | 'telegram' | 'zalo' | 'sms' | 'pdf_generated' | 'file_word' | 'file_excel' | 'file_pdf' | string;
  content?: string;
  file_path?: string;
  metadata?: Record<string, unknown>;
  variables?: string[] | Record<string, unknown>;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at?: string;
}
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
cd d:/microservice-fe && npx tsc --noEmit 2>&1 | head -30
```

Expected: zero errors (or same errors as before this change — only pre-existing errors acceptable).

- [ ] **Step 3: Commit**

```bash
cd d:/microservice-fe
git add src/types/system.ts
git commit -m "feat(types): add full config-service types — Country, Province, Ward, MenuItem, EmailConfig, ApiResponse"
```

---

## Task 2: Fix `location.ts` endpoints

**Files:**
- Modify: `src/lib/api/endpoints/core/location.ts`

- [ ] **Step 1: Replace the file content**

```typescript
type Id = string | number;

export const locationEndpoints = {
    public: {
        countries: "/api/config/countries",
        provinces: "/api/config/provinces",
        wards: "/api/config/wards",
        provincesByCountry: (countryId: Id) => `/api/config/countries/${countryId}/provinces`,
        wardsByProvince: (provinceId: Id) => `/api/config/provinces/${provinceId}/wards`,
    },
    admin: {
        countries: {
            list: "/api/config/admin/countries",
            simple: "/api/config/admin/countries/simple",
            create: "/api/config/admin/countries",
            show: (id: Id) => `/api/config/admin/countries/${id}`,
            update: (id: Id) => `/api/config/admin/countries/${id}`,
            delete: (id: Id) => `/api/config/admin/countries/${id}`,
        },
        provinces: {
            list: "/api/config/admin/provinces",
            simple: "/api/config/admin/provinces/simple",
            create: "/api/config/admin/provinces",
            show: (id: Id) => `/api/config/admin/provinces/${id}`,
            update: (id: Id) => `/api/config/admin/provinces/${id}`,
            delete: (id: Id) => `/api/config/admin/provinces/${id}`,
        },
        wards: {
            list: "/api/config/admin/wards",
            simple: "/api/config/admin/wards/simple",
            create: "/api/config/admin/wards",
            show: (id: Id) => `/api/config/admin/wards/${id}`,
            update: (id: Id) => `/api/config/admin/wards/${id}`,
            delete: (id: Id) => `/api/config/admin/wards/${id}`,
        },
    },
} as const;
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd d:/microservice-fe && npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
cd d:/microservice-fe
git add src/lib/api/endpoints/core/location.ts
git commit -m "fix(endpoints): align location endpoints with config-service paths (/api/config/*)"
```

---

## Task 3: Fix `menus.ts` endpoints

**Files:**
- Modify: `src/lib/api/endpoints/core/menus.ts`

- [ ] **Step 1: Replace the file content**

```typescript
type Id = string | number;

export const menuEndpoints = {
    public: {
        list: "/api/config/menus",
    },
    user: {
        list: "/api/config/menus/user",
    },
    admin: {
        list: "/api/config/menus/admin",
        tree: "/api/config/menus/admin/tree",
        create: "/api/config/menus",
        show: (id: Id) => `/api/config/menus/admin/${id}`,
        update: (id: Id) => `/api/config/menus/${id}`,
        delete: (id: Id) => `/api/config/menus/${id}`,
        userList: "/api/config/menus/user",
    },
} as const;
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd d:/microservice-fe && npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
cd d:/microservice-fe
git add src/lib/api/endpoints/core/menus.ts
git commit -m "fix(endpoints): align menu endpoints with config-service paths; add user menus section"
```

---

## Task 4: Fix `systemConfig.ts` endpoints

**Files:**
- Modify: `src/lib/api/endpoints/core/systemConfig.ts`

- [ ] **Step 1: Replace the file content**

```typescript
export const systemConfigEndpoints = {
    public: {
        getByGroup: (group: string) => `/api/config/${group}`,
        general: "/api/config/general",
    },
    admin: {
        getByGroup: (group: string) => `/api/config/${group}`,
        update: (group: string) => `/api/config/config/${group}`,
        updateGeneral: "/api/config/config/general",
        updateEmail: "/api/config/config/email",
        enums: {
            all: "/api/enums",
            byName: (type: string) => `/api/enums/${type}`,
        },
    },
} as const;
```

Note: `admin.update(group)` now produces `/api/config/config/general` for `group="general"` — correct per spec.

- [ ] **Step 2: Verify TypeScript**

```bash
cd d:/microservice-fe && npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
cd d:/microservice-fe
git add src/lib/api/endpoints/core/systemConfig.ts
git commit -m "fix(endpoints): fix systemConfig admin update path; add updateGeneral and updateEmail endpoints"
```

---

## Task 5: Update backward-compat layer (`index.ts`)

**Files:**
- Modify: `src/lib/api/endpoints/index.ts`

- [ ] **Step 1: Add `menuEndpoints.user` to the imports block**

Find:
```typescript
import {
    userManagementEndpoints,
    roleEndpoints,
    permissionEndpoints,
    groupEndpoints,
    menuEndpoints,
    systemConfigEndpoints,
    contentTemplateEndpoints,
    contextEndpoints,
    locationEndpoints,
} from './core';
```

No change needed — `menuEndpoints` already imported; its new `.user` property is automatically available.

- [ ] **Step 2: Add `updateEmail` to `adminEndpoints.systemConfigs`**

Find:
```typescript
    systemConfigs: {
        getByGroup: systemConfigEndpoints.admin.getByGroup,
        update: systemConfigEndpoints.admin.update,
    },
```

Replace with:
```typescript
    systemConfigs: {
        getByGroup: systemConfigEndpoints.admin.getByGroup,
        update: systemConfigEndpoints.admin.update,
        updateEmail: systemConfigEndpoints.admin.updateEmail,
    },
```

- [ ] **Step 3: Add user menus to `userEndpoints`**

Find:
```typescript
export const userEndpoints = {
    auth: {
        login: authEndpoints.login,
        register: authEndpoints.register,
        sendOtpRegister: authEndpoints.sendOtpRegister,
        sendOtpForgotPassword: authEndpoints.sendOtpForgotPassword,
        resetPassword: authEndpoints.resetPassword,
        logout: authEndpoints.logout,
        logoutAll: authEndpoints.logoutAll,
        refresh: authEndpoints.refresh,
        google: authEndpoints.google,
    },
    profile: authEndpoints.profile,
    groups: groupEndpoints.user,
    uploads: uploadEndpoints,
    comments: comicCommentEndpoints.user,
    reviews: comicReviewEndpoints.user,
    bookmarks: bookmarkEndpoints.user,
    readingHistory: readingHistoryEndpoints.user,
    follows: followEndpoints.user,
} as const;
```

Replace with:
```typescript
export const userEndpoints = {
    auth: {
        login: authEndpoints.login,
        register: authEndpoints.register,
        sendOtpRegister: authEndpoints.sendOtpRegister,
        sendOtpForgotPassword: authEndpoints.sendOtpForgotPassword,
        resetPassword: authEndpoints.resetPassword,
        logout: authEndpoints.logout,
        logoutAll: authEndpoints.logoutAll,
        refresh: authEndpoints.refresh,
        google: authEndpoints.google,
    },
    profile: authEndpoints.profile,
    groups: groupEndpoints.user,
    uploads: uploadEndpoints,
    menus: menuEndpoints.user,
    comments: comicCommentEndpoints.user,
    reviews: comicReviewEndpoints.user,
    bookmarks: bookmarkEndpoints.user,
    readingHistory: readingHistoryEndpoints.user,
    follows: followEndpoints.user,
} as const;
```

- [ ] **Step 4: Verify TypeScript**

```bash
cd d:/microservice-fe && npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 5: Commit**

```bash
cd d:/microservice-fe
git add src/lib/api/endpoints/index.ts
git commit -m "feat(endpoints): expose updateEmail and user menus in backward-compat layer"
```

---

## Task 6: Unify `SystemConfigGeneral` with `SystemConfig`

**Files:**
- Modify: `src/hooks/data/system/useSystemConfigCache.ts`
- Modify: `src/hooks/data/system/useSystemConfigFetch.ts`

The `SystemConfigGeneral` interface in `useSystemConfigCache.ts` duplicates `SystemConfig` from `@/types/system`. After Task 1 adds `name?` to `SystemConfig`, they are identical — we can replace one with the other.

- [ ] **Step 1: Update `useSystemConfigCache.ts`**

Replace the `SystemConfigGeneral` interface definition and the import block. Find:

```typescript
"use client";

import { useState, useMemo, useCallback } from "react";

// ===== TYPES =====

export interface SystemConfigGeneral {
  [key: string]: unknown;
  id?: string;
  site_name?: string;
  site_description?: string | null;
  site_logo?: string | null;
  site_favicon?: string | null;
  site_email?: string | null;
  site_phone?: string | null;
  site_address?: string | null;
  site_country_id?: string | null;
  site_province_id?: string | null;
  site_ward_id?: string | null;
  site_copyright?: string | null;
  timezone?: string;
  locale?: string;
  currency?: string;
  contact_channels?: Array<{
    type: string;
    value: string;
    label?: string;
    icon?: string;
    url_template?: string;
    enabled: boolean;
    sort_order?: number;
  }>;
  meta_title?: string | null;
  meta_keywords?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  canonical_url?: string | null;
  google_analytics_id?: string | null;
  google_search_console?: string | null;
  facebook_pixel_id?: string | null;
  twitter_site?: string | null;
  created_at?: string;
  updated_at?: string;
}
```

Replace with:

```typescript
"use client";

import { useState, useMemo, useCallback } from "react";
import type { SystemConfig } from "@/types/system";

// ===== TYPES =====

/** Alias for SystemConfig — kept for backward compatibility */
export type SystemConfigGeneral = SystemConfig;
```

- [ ] **Step 2: Verify `useSystemConfigFetch.ts` still compiles**

The import `import type { SystemConfigGeneral } from "./useSystemConfigCache"` in `useSystemConfigFetch.ts` will still work because we re-export it as a type alias. No change needed in `useSystemConfigFetch.ts`.

```bash
cd d:/microservice-fe && npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
cd d:/microservice-fe
git add src/hooks/data/system/useSystemConfigCache.ts
git commit -m "refactor(hooks): unify SystemConfigGeneral with SystemConfig from types/system"
```

---

## Task 7: Final TypeScript check

- [ ] **Step 1: Run full type check**

```bash
cd d:/microservice-fe && npx tsc --noEmit 2>&1
```

Expected: zero new errors. If errors appear, they will be from consumers of the changed endpoints — fix the specific import/usage in each reported file.

- [ ] **Step 2: Common fixes if errors appear**

**Error: `Property 'restore' does not exist on type ...`**
Search and remove any usage of `menuEndpoints.admin.restore` — this endpoint was removed as it is not in the config-service spec.

**Error: `SystemConfigGeneral` type mismatch**
Any file importing `SystemConfigGeneral` from `useSystemConfigCache` will still work (it's re-exported as a type alias). If a file imported the interface by spreading it — update to use `SystemConfig` from `@/types/system` directly.

- [ ] **Step 3: Final commit (if fixes were needed)**

```bash
cd d:/microservice-fe
git add -p
git commit -m "fix(types): resolve TypeScript errors after config-service endpoint alignment"
```
