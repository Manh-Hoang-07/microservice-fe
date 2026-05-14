# Config Service Re-integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all endpoint paths, HTTP methods, and types in the frontend to match the config-service API documentation.

**Architecture:** The frontend uses a layered API architecture: endpoint constants -> service layer -> hooks -> components. We fix from bottom up: endpoints first, then types, then hooks, then components. All changes are in the data/API layer; no UI changes needed.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Axios, Zustand, React Query

**Reference doc:** `D:\microservice\docs\frontend-config-integration.md`

---

### Task 1: Fix Menu Endpoint Paths

**Files:**
- Modify: `src/lib/api/endpoints/core/menus.ts`

All menu endpoint paths have incorrect structure. The API uses `/api/config/admin/menus/...` and `/api/config/user/menus`, but the code has `/api/config/menus/admin/...` and `/api/config/menus/user`.

- [ ] **Step 1: Rewrite menus.ts with correct paths**

Replace the entire content of `src/lib/api/endpoints/core/menus.ts` with:

```typescript
type Id = string | number;

export const menuEndpoints = {
    public: {
        list: "/api/config/menus",
    },
    user: {
        list: "/api/config/user/menus",
    },
    admin: {
        list: "/api/config/admin/menus",
        tree: "/api/config/admin/menus/tree",
        create: "/api/config/admin/menus",
        show: (id: Id) => `/api/config/admin/menus/${id}`,
        update: (id: Id) => `/api/config/admin/menus/${id}`,
        delete: (id: Id) => `/api/config/admin/menus/${id}`,
    },
} as const;
```

- [ ] **Step 2: Verify no stale references remain**

Run: `grep -r "api/config/menus/admin\|api/config/menus/user" src/`
Expected: No matches (all references go through the endpoint constants)

- [ ] **Step 3: Commit**

```bash
git add src/lib/api/endpoints/core/menus.ts
git commit -m "fix(endpoints): correct all menu endpoint paths to match config-service API"
```

---

### Task 2: Fix SystemConfig Endpoint Paths + Add Cache Flush

**Files:**
- Modify: `src/lib/api/endpoints/core/systemConfig.ts`

Admin endpoints use wrong prefix (`/api/config/config/` instead of `/api/config/admin/`). Admin GET is missing. Cache flush endpoint is missing.

- [ ] **Step 1: Rewrite systemConfig.ts with correct paths**

Replace the entire content of `src/lib/api/endpoints/core/systemConfig.ts` with:

```typescript
export const systemConfigEndpoints = {
    public: {
        getByGroup: (group: string) => `/api/config/${group}`,
        general: "/api/config/general",
    },
    admin: {
        general: "/api/config/admin/general",
        getByGroup: (group: string) => `/api/config/admin/${group}`,
        update: (group: string) => `/api/config/admin/${group}`,
        updateGeneral: "/api/config/admin/general",
        updateEmail: "/api/config/admin/email",
        enums: {
            all: "/api/enums",
            byName: (type: string) => `/api/enums/${type}`,
        },
    },
    cache: {
        flush: "/api/config/cache/flush",
    },
} as const;
```

- [ ] **Step 2: Verify no stale references remain**

Run: `grep -r "api/config/config/" src/`
Expected: No matches

- [ ] **Step 3: Commit**

```bash
git add src/lib/api/endpoints/core/systemConfig.ts
git commit -m "fix(endpoints): correct systemConfig admin paths, add cache flush endpoint"
```

---

### Task 3: Update Backward-Compat Layer in endpoints/index.ts

**Files:**
- Modify: `src/lib/api/endpoints/index.ts`

The `adminEndpoints.systemConfigs` and `adminEndpoints.menus` backward-compat mappings need to reflect the fixed endpoint objects. Also remove the stale `userList` reference.

- [ ] **Step 1: Update adminEndpoints.menus — remove userList alias**

In `src/lib/api/endpoints/index.ts`, change the menus and userMenus entries:

```typescript
// Old:
    menus: menuEndpoints.admin,
    userMenus: { list: menuEndpoints.admin.userList },

// New:
    menus: menuEndpoints.admin,
    userMenus: { list: menuEndpoints.user.list },
```

- [ ] **Step 2: Update adminEndpoints.systemConfigs — add general read endpoint**

```typescript
// Old:
    systemConfigs: {
        getByGroup: systemConfigEndpoints.admin.getByGroup,
        update: systemConfigEndpoints.admin.update,
        updateEmail: systemConfigEndpoints.admin.updateEmail,
    },

// New:
    systemConfigs: {
        general: systemConfigEndpoints.admin.general,
        getByGroup: systemConfigEndpoints.admin.getByGroup,
        update: systemConfigEndpoints.admin.update,
        updateGeneral: systemConfigEndpoints.admin.updateGeneral,
        updateEmail: systemConfigEndpoints.admin.updateEmail,
    },
```

- [ ] **Step 3: Add cache to publicEndpoints**

After the `location` entry in `publicEndpoints`:

```typescript
    cache: systemConfigEndpoints.cache,
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/api/endpoints/index.ts
git commit -m "fix(endpoints): update backward-compat layer for menus and systemConfig"
```

---

### Task 4: Fix Location Types — IDs Must Be Strings

**Files:**
- Modify: `src/types/location.ts`

The API doc states: "ID luon la string — BigInt duoc serialize thanh string". Current types use `id: number` and FK `_id: number`.

- [ ] **Step 1: Fix AdminCountry**

```typescript
// Old:
export interface AdminCountry {
  id: number;
  ...
  created_user_id?: number | null;
  updated_user_id?: number | null;

// New:
export interface AdminCountry {
  id: string;
  ...
  created_user_id?: string | null;
  updated_user_id?: string | null;
```

- [ ] **Step 2: Fix AdminProvince**

```typescript
// Old:
export interface AdminProvince {
  id: number;
  ...
  country_id: number;
  ...
  created_user_id?: number | null;
  updated_user_id?: number | null;

// New:
export interface AdminProvince {
  id: string;
  ...
  country_id: string;
  ...
  created_user_id?: string | null;
  updated_user_id?: string | null;
```

- [ ] **Step 3: Fix AdminWard**

```typescript
// Old:
export interface AdminWard {
  id: number;
  province_id: number;
  ...
  created_user_id?: number | null;
  updated_user_id?: number | null;

// New:
export interface AdminWard {
  id: string;
  province_id: string;
  ...
  created_user_id?: string | null;
  updated_user_id?: string | null;
```

- [ ] **Step 4: Commit**

```bash
git add src/types/location.ts
git commit -m "fix(types): change location IDs from number to string per API spec"
```

---

### Task 5: Fix System Types — Menu ID + Comments

**Files:**
- Modify: `src/types/system.ts`

Menu `id` should be string. MenuItem needs `created_at`/`updated_at`. Fix stale path comments on payloads.

- [ ] **Step 1: Fix Menu interface id**

```typescript
// Old:
export interface Menu {
  id: number;

// New:
export interface Menu {
  id: string;
```

- [ ] **Step 2: Fix GeneralConfigPayload comment**

```typescript
// Old:
/** PUT /api/config/config/general */
export interface GeneralConfigPayload {

// New:
/** PUT /api/config/admin/general */
export interface GeneralConfigPayload {
```

- [ ] **Step 3: Fix EmailConfig comment**

```typescript
// Old:
/** PUT /api/config/config/email */
export interface EmailConfig {

// New:
/** PUT /api/config/admin/email */
export interface EmailConfig {
```

- [ ] **Step 4: Add created_at/updated_at to MenuItem**

```typescript
// Old:
  group?: string | null;
  children?: MenuItem[];
}

// New:
  group?: string | null;
  children?: MenuItem[];
  created_at?: string;
  updated_at?: string;
}
```

- [ ] **Step 5: Commit**

```bash
git add src/types/system.ts
git commit -m "fix(types): fix Menu id type, add MenuItem timestamps, fix payload comments"
```

---

### Task 6: Add PATCH Support to useFormModal

**Files:**
- Modify: `src/hooks/crud/useFormModal.ts`

The API doc uses PATCH for location updates (countries, provinces, wards). Currently useFormModal hardcodes `apiClient.put()` for edit mode. Add an optional `updateMethod` option.

- [ ] **Step 1: Add updateMethod to UseFormModalOptions**

```typescript
// Old:
export interface UseFormModalOptions {
  /** Message khi tao thanh cong */
  createSuccessMessage?: string;

// New:
export interface UseFormModalOptions {
  /** HTTP method cho update: 'put' | 'patch' (default: 'put') */
  updateMethod?: 'put' | 'patch';
  /** Message khi tao thanh cong */
  createSuccessMessage?: string;
```

- [ ] **Step 2: Destructure updateMethod in the hook body**

```typescript
// Old:
  const {
    createSuccessMessage = "Tao thanh cong",
    updateSuccessMessage = "Cap nhat thanh cong",
    fetchErrorMessage = "Khong the tai du lieu",
    onSuccess,
    onClose,
  } = options;

// New:
  const {
    updateMethod = 'put',
    createSuccessMessage = "Tao thanh cong",
    updateSuccessMessage = "Cap nhat thanh cong",
    fetchErrorMessage = "Khong the tai du lieu",
    onSuccess,
    onClose,
  } = options;
```

- [ ] **Step 3: Use updateMethod in handleSubmit**

```typescript
// Old:
          await apiClient.put(target.updateApi, formData);

// New:
          await apiClient[updateMethod](target.updateApi, formData);
```

- [ ] **Step 4: Add updateMethod to handleSubmit useCallback deps**

```typescript
// Old:
    [isEditMode, props, showSuccess, showError, createSuccessMessage, updateSuccessMessage, onSuccess]

// New:
    [isEditMode, props, showSuccess, showError, createSuccessMessage, updateSuccessMessage, updateMethod, onSuccess]
```

- [ ] **Step 5: Commit**

```bash
git add src/hooks/crud/useFormModal.ts
git commit -m "feat(hooks): add updateMethod option to useFormModal for PATCH support"
```

---

### Task 7: Fix Location Edit Components to Use PATCH

**Files:**
- Modify: `src/components/Features/Core/Locations/Countries/Admin/EditCountry.tsx`
- Modify: `src/components/Features/Core/Locations/Provinces/Admin/EditProvince.tsx`
- Modify: `src/components/Features/Core/Locations/Wards/Admin/EditWard.tsx`

Pass `updateMethod: "patch"` to useFormModal in all three location edit components.

- [ ] **Step 1: Fix EditCountry.tsx**

```typescript
// Old:
    { updateSuccessMessage: "Cap nhat quoc gia thanh cong", fetchErrorMessage: "Khong the tai thong tin quoc gia", onSuccess, onClose }

// New:
    { updateMethod: "patch", updateSuccessMessage: "Cap nhat quoc gia thanh cong", fetchErrorMessage: "Khong the tai thong tin quoc gia", onSuccess, onClose }
```

- [ ] **Step 2: Fix EditProvince.tsx**

```typescript
// Old:
    { updateSuccessMessage: "Cap nhat Tinh/Thanh pho thanh cong", fetchErrorMessage: "Khong the tai thong tin Tinh/Thanh pho", onSuccess, onClose }

// New:
    { updateMethod: "patch", updateSuccessMessage: "Cap nhat Tinh/Thanh pho thanh cong", fetchErrorMessage: "Khong the tai thong tin Tinh/Thanh pho", onSuccess, onClose }
```

- [ ] **Step 3: Fix EditWard.tsx**

```typescript
// Old:
    { updateSuccessMessage: "Cap nhat Phuong/Xa thanh cong", fetchErrorMessage: "Khong the tai thong tin Phuong/Xa", onSuccess, onClose }

// New:
    { updateMethod: "patch", updateSuccessMessage: "Cap nhat Phuong/Xa thanh cong", fetchErrorMessage: "Khong the tai thong tin Phuong/Xa", onSuccess, onClose }
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Features/Core/Locations/Countries/Admin/EditCountry.tsx \
      src/components/Features/Core/Locations/Provinces/Admin/EditProvince.tsx \
      src/components/Features/Core/Locations/Wards/Admin/EditWard.tsx
git commit -m "fix(location): use PATCH method for country/province/ward updates"
```

---

### Task 8: Fix useSystemConfigFetch — Use Admin Endpoint When isAdmin

**Files:**
- Modify: `src/hooks/data/system/useSystemConfigFetch.ts`

The `resolveEndpoint` function currently always returns the public endpoint, ignoring `isAdmin`. Fix it to use the admin endpoint when `isAdmin=true`.

- [ ] **Step 1: Fix resolveEndpoint function**

```typescript
// Old:
const resolveEndpoint = (group: string, isAdmin: boolean): string => {
  // Config microservice: cung endpoint cho ca public va admin
  // Admin chi khac o cho gui kem Authorization header (da co interceptor)
  if (group === "general") return publicEndpoints.systemConfigs.general;
  return publicEndpoints.systemConfigs.getByGroup(group);
};

// New:
const resolveEndpoint = (group: string, isAdmin: boolean): string => {
  if (isAdmin) {
    if (group === "general") return adminEndpoints.systemConfigs.general;
    return adminEndpoints.systemConfigs.getByGroup(group);
  }
  if (group === "general") return publicEndpoints.systemConfigs.general;
  return publicEndpoints.systemConfigs.getByGroup(group);
};
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/data/system/useSystemConfigFetch.ts
git commit -m "fix(hooks): use admin endpoint for systemConfig when isAdmin=true"
```

---

### Task 9: Fix Admin Location Service Types

**Files:**
- Modify: `src/lib/api/admin/location.ts`

Align `ProvinceListParams.country_id` and `WardListParams.province_id` types to `string` for consistency with the fixed location types.

- [ ] **Step 1: Fix ProvinceListParams**

```typescript
// Old:
export interface ProvinceListParams extends LocationListParams {
  country_id?: number | string;
}

// New:
export interface ProvinceListParams extends LocationListParams {
  country_id?: string;
}
```

- [ ] **Step 2: Fix WardListParams**

```typescript
// Old:
export interface WardListParams extends LocationListParams {
  province_id?: number | string;
}

// New:
export interface WardListParams extends LocationListParams {
  province_id?: string;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/api/admin/location.ts
git commit -m "fix(services): align location service param types to string IDs"
```

---

### Task 10: Build Verification

- [ ] **Step 1: Run TypeScript type check**

Run: `npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 3: Fix any type errors found**

If there are type errors from the `id: number` → `string` change (e.g., components comparing `id` as number), fix them.
