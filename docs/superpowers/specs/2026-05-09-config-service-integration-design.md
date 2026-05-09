# Config Service Frontend Integration — Design Spec

**Date:** 2026-05-09
**Scope:** Align frontend API layer with `docs/frontend-config-integration.md`
**Base URL:** `/api/config` (Nginx proxy → config-service:3003)

---

## 1. Endpoint Layer

### 1.1 `src/lib/api/endpoints/core/location.ts`

**Fix paths:**
- Public: `/api/public/location/*` → `/api/config/countries|provinces|wards`
- Admin: `/api/admin/location/*` → `/api/config/admin/countries|provinces|wards`

**Add missing:**
- `public.provincesByCountry: (id) => /api/config/countries/:id/provinces`
- `public.wardsByProvince: (id) => /api/config/provinces/:id/wards`

### 1.2 `src/lib/api/endpoints/core/menus.ts`

**Fix paths:**
- `public.list`: `/api/public/menus` → `/api/config/menus`
- `admin.list`: `/api/admin/menus` → `/api/config/menus/admin`
- `admin.tree`: `/api/admin/menus/tree` → `/api/config/menus/admin/tree`
- `admin.show`: `/api/admin/menus/:id` → `/api/config/menus/admin/:id`
- `admin.create`: `/api/admin/menus` → `/api/config/menus`
- `admin.update/delete`: `/api/admin/menus/:id` → `/api/config/menus/:id`
- `admin.userList`: `/api/admin/user/menus` → `/api/config/menus/user`

**Add missing:**
- `user: { list: "/api/config/menus/user" }`

### 1.3 `src/lib/api/endpoints/core/systemConfig.ts`

**Fix:** `admin.update`: `/api/config/${group}` → `/api/config/config/${group}`

**Add:**
- `admin.updateGeneral: "/api/config/config/general"`
- `admin.updateEmail: "/api/config/config/email"`

---

## 2. Backward Compat Layer (`src/lib/api/endpoints/index.ts`)

- `adminEndpoints.systemConfigs` + `updateEmail`
- `userEndpoints` + `menus: { user: menuEndpoints.user.list }`
- `publicEndpoints.location` + `provincesByCountry`, `wardsByProvince`

---

## 3. Type System (`src/types/system.ts`)

Add types matching API response (snake_case from DB):

- `ApiResponse<T>` — `{ success, data: T, meta?: PaginatedMeta, timestamp }`
- `PaginatedMeta` — `{ page, limit, total, totalPages }`
- `Country` — full fields from doc
- `Province` — full fields
- `Ward` — full fields
- `MenuItem` — full fields (replaces minimal `Menu`)
- `EmailConfig` — camelCase payload for PUT
- `GeneralConfigPayload` — camelCase payload for PUT
- `ContactChannelPayload` — camelCase version

---

## 4. Hook/Cache Unification

- `useSystemConfigCache.ts`: Remove duplicate `SystemConfigGeneral` definition, import `SystemConfig` from `@/types/system`
- `useSystemConfigFetch.ts`: Update type references — no logic changes needed

---

## Architecture Notes

- All config-service calls go through `/api/config/*` (no `/api/public/` or `/api/admin/` prefix for this service)
- Admin routes within config-service use `/api/config/admin/*` not `/api/admin/*`
- Admin config update uses `/api/config/config/*` (double `config` is correct per spec)
- Response format always `{ success, data, meta?, timestamp }` — no changes to response normalizer needed
- Auth: public routes need no token, user/admin routes rely on existing interceptor in `client.ts`
