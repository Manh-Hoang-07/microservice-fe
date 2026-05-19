# PR 2: Notification UI — Bell Icon, User Page, Admin Management

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây dựng UI thông báo hoàn chỉnh: bell icon trong header với dropdown, trang `/user/notifications` đầy đủ, và trang admin `/admin/notifications` với danh sách + gửi hàng loạt.

**Architecture:** Tạo endpoints mới cho notification service, hooks dùng @tanstack/react-query, components theo pattern hiện có trong codebase. Bell icon được thêm vào `PublicHeader` (client component), trang user dùng layout hiện có, trang admin dùng app router.

**Tech Stack:** TypeScript, Next.js 14 App Router, React, @tanstack/react-query, axios, heroicons/react

---

## File Map

### Files sẽ được tạo (Create)
- `src/lib/api/endpoints/core/notifications.ts`
- `src/hooks/data/user/useNotifications.ts`
- `src/hooks/data/admin/useAdminNotifications.ts`
- `src/components/Features/Notification/User/NotificationBell.tsx`
- `src/components/Features/Notification/User/NotificationDropdown.tsx`
- `src/components/Features/Notification/User/NotificationList.tsx`
- `src/app/(user)/user/notifications/page.tsx`
- `src/components/Features/Notification/Admin/AdminNotifications.tsx`
- `src/components/Features/Notification/Admin/NotificationListTab.tsx`
- `src/components/Features/Notification/Admin/SendNotificationForm.tsx`
- `src/app/(admin)/admin/notifications/page.tsx`

### Files sẽ bị sửa (Modify)
- `src/lib/api/endpoints/core/index.ts` — export notificationEndpoints
- `src/lib/api/endpoints/index.ts` — thêm notifications vào adminEndpoints và userEndpoints

---

## Task 1: Tạo notification endpoint definitions

**Files:**
- Create: `src/lib/api/endpoints/core/notifications.ts`
- Modify: `src/lib/api/endpoints/core/index.ts`
- Modify: `src/lib/api/endpoints/index.ts`

- [ ] **Step 1: Tạo `notifications.ts`**

```ts
// src/lib/api/endpoints/core/notifications.ts
type Id = string | number;

export const notificationEndpoints = {
    user: {
        list: "/api/notifications/user/notifications",
        unreadCount: "/api/notifications/user/notifications/unread/count",
        show: (id: Id) => `/api/notifications/user/notifications/${id}`,
        markRead: (id: Id) => `/api/notifications/user/notifications/${id}/read`,
        markAllRead: "/api/notifications/user/notifications/read-all",
    },
    admin: {
        list: "/api/notifications/admin/notifications",
        send: "/api/notifications/admin/notifications/send",
        delete: (id: Id) => `/api/notifications/admin/notifications/${id}`,
    },
} as const;
```

- [ ] **Step 2: Export từ `core/index.ts`**

Thêm dòng vào cuối file `src/lib/api/endpoints/core/index.ts`:
```ts
export { notificationEndpoints } from './notifications';
```

File sau khi sửa:
```ts
// src/lib/api/endpoints/core/index.ts
export { userManagementEndpoints } from './users';
export { roleEndpoints } from './roles';
export { permissionEndpoints } from './permissions';
export { groupEndpoints } from './groups';
export { menuEndpoints } from './menus';
export { systemConfigEndpoints } from './systemConfig';
export { contentTemplateEndpoints } from './contentTemplates';
export { locationEndpoints } from './location';
export { uploadEndpoints } from './uploads';
export { notificationEndpoints } from './notifications';
```

- [ ] **Step 3: Thêm vào `index.ts` — import và khai báo trong adminEndpoints + userEndpoints**

Trong `src/lib/api/endpoints/index.ts`:

**Tìm đoạn import từ core:**
```ts
import {
    userManagementEndpoints,
    roleEndpoints,
    permissionEndpoints,
    groupEndpoints,
    menuEndpoints,
    systemConfigEndpoints,
    contentTemplateEndpoints,
    locationEndpoints,
} from './core';
```

**Thay bằng:**
```ts
import {
    userManagementEndpoints,
    roleEndpoints,
    permissionEndpoints,
    groupEndpoints,
    menuEndpoints,
    systemConfigEndpoints,
    contentTemplateEndpoints,
    locationEndpoints,
    notificationEndpoints,
} from './core';
```

**Tìm trong `adminEndpoints`:**
```ts
    location: locationEndpoints.admin,
} as const;
```

**Thay bằng:**
```ts
    location: locationEndpoints.admin,
    notifications: notificationEndpoints.admin,
} as const;
```

**Tìm trong `userEndpoints`:**
```ts
    follows: followEndpoints.user,
} as const;
```

**Thay bằng:**
```ts
    follows: followEndpoints.user,
    notifications: notificationEndpoints.user,
} as const;
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/api/endpoints/core/notifications.ts \
        src/lib/api/endpoints/core/index.ts \
        src/lib/api/endpoints/index.ts
git commit -m "feat: add notification service endpoints"
```

---

## Task 2: Tạo user notification hooks

**Files:**
- Create: `src/hooks/data/user/useNotifications.ts`

- [ ] **Step 1: Tạo hook**

```ts
// src/hooks/data/user/useNotifications.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store/authStore";
import { useToastContext } from "@/lib/toast";
import { api } from "@/lib/api/client";
import { userEndpoints } from "@/lib/api/endpoints";

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    data: Record<string, unknown> | null;
    isRead: boolean;
    readAt: string | null;
    status: "active" | "archived" | "deleted";
    createdAt: string;
    updatedAt: string;
}

interface NotificationListParams {
    page?: number;
    limit?: number;
    type?: string;
    isRead?: boolean;
}

interface NotificationListResponse {
    success: boolean;
    data: Notification[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

interface UnreadCountResponse {
    success: boolean;
    data: { count: number };
}

const endpoints = userEndpoints.notifications;

export function useNotifications(params?: NotificationListParams) {
    const { isAuthenticated } = useAuthStore();
    const hasToken = typeof window !== "undefined" && document.cookie.includes("auth_token");

    return useQuery<NotificationListResponse>({
        queryKey: ["notifications", params],
        queryFn: async () => {
            const { data } = await api.get<NotificationListResponse>(endpoints.list, { params });
            return data;
        },
        enabled: isAuthenticated && hasToken,
        staleTime: 30 * 1000,
    });
}

export function useUnreadCount() {
    const { isAuthenticated } = useAuthStore();
    const hasToken = typeof window !== "undefined" && document.cookie.includes("auth_token");

    return useQuery<UnreadCountResponse>({
        queryKey: ["notifications", "unreadCount"],
        queryFn: async () => {
            const { data } = await api.get<UnreadCountResponse>(endpoints.unreadCount);
            return data;
        },
        enabled: isAuthenticated && hasToken,
        staleTime: 30 * 1000,
        refetchInterval: 60 * 1000,
    });
}

export function useMarkRead() {
    const queryClient = useQueryClient();
    const { showError } = useToastContext();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.patch(endpoints.markRead(id));
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
        onError: () => showError("Không thể đánh dấu đã đọc"),
    });
}

export function useMarkAllRead() {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToastContext();

    return useMutation({
        mutationFn: async () => {
            const { data } = await api.patch(endpoints.markAllRead);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            showSuccess("Đã đánh dấu tất cả là đã đọc");
        },
        onError: () => showError("Không thể thực hiện thao tác"),
    });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/data/user/useNotifications.ts
git commit -m "feat: add useNotifications, useUnreadCount, useMarkRead, useMarkAllRead hooks"
```

---

## Task 3: Tạo admin notification hook

**Files:**
- Create: `src/hooks/data/admin/useAdminNotifications.ts`

- [ ] **Step 1: Tạo hook**

```ts
// src/hooks/data/admin/useAdminNotifications.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastContext } from "@/lib/toast";
import { api } from "@/lib/api/client";
import { adminEndpoints } from "@/lib/api/endpoints";
import { Notification } from "@/hooks/data/user/useNotifications";

interface AdminNotificationListParams {
    page?: number;
    limit?: number;
    userId?: string;
    type?: string;
    status?: string;
    isRead?: boolean;
}

interface AdminNotificationListResponse {
    success: boolean;
    data: Notification[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

interface SendNotificationPayload {
    userIds: string[];
    title: string;
    message: string;
    type?: "info" | "success" | "warning" | "error";
    data?: Record<string, unknown>;
}

const endpoints = adminEndpoints.notifications;

export function useAdminNotificationList(params?: AdminNotificationListParams) {
    return useQuery<AdminNotificationListResponse>({
        queryKey: ["admin", "notifications", params],
        queryFn: async () => {
            const { data } = await api.get<AdminNotificationListResponse>(endpoints.list, { params });
            return data;
        },
        staleTime: 30 * 1000,
    });
}

export function useSendNotification() {
    const { showSuccess, showError } = useToastContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: SendNotificationPayload) => {
            const { data } = await api.post(endpoints.send, payload);
            return data;
        },
        onSuccess: (data: { success: boolean; data: { sent: number } }) => {
            showSuccess(`Đã gửi thông báo đến ${data.data?.sent ?? 0} người dùng`);
            queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
        },
        onError: () => showError("Không thể gửi thông báo. Vui lòng kiểm tra lại."),
    });
}

export function useDeleteNotification() {
    const { showSuccess, showError } = useToastContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.delete(endpoints.delete(id));
            return data;
        },
        onSuccess: () => {
            showSuccess("Đã xóa thông báo");
            queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
        },
        onError: () => showError("Không thể xóa thông báo"),
    });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/data/admin/useAdminNotifications.ts
git commit -m "feat: add admin notification hooks for list, send, delete"
```

---

## Task 4: Tạo NotificationBell và NotificationDropdown

**Files:**
- Create: `src/components/Features/Notification/User/NotificationBell.tsx`
- Create: `src/components/Features/Notification/User/NotificationDropdown.tsx`

- [ ] **Step 1: Tạo `NotificationDropdown.tsx`**

```tsx
// src/components/Features/Notification/User/NotificationDropdown.tsx
"use client";

import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Notification, useNotifications, useMarkRead, useMarkAllRead } from "@/hooks/data/user/useNotifications";

const TYPE_ICONS: Record<Notification["type"], string> = {
    info: "ℹ️",
    success: "✅",
    warning: "⚠️",
    error: "❌",
};

interface NotificationDropdownProps {
    onClose: () => void;
}

export default function NotificationDropdown({ onClose }: NotificationDropdownProps) {
    const router = useRouter();
    const { data, isLoading } = useNotifications({ limit: 10 });
    const { mutate: markRead } = useMarkRead();
    const { mutate: markAllRead, isPending: isMarkingAll } = useMarkAllRead();

    const notifications = data?.data ?? [];

    const handleClickItem = (notification: Notification) => {
        if (!notification.isRead) {
            markRead(notification.id);
        }
        const link = notification.data?.link as string | undefined;
        if (link) {
            router.push(link);
        }
        onClose();
    };

    return (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="font-semibold text-sm text-gray-900">Thông báo</span>
                <button
                    onClick={() => markAllRead()}
                    disabled={isMarkingAll}
                    className="text-xs text-primary hover:underline disabled:opacity-50"
                >
                    Đánh dấu tất cả đã đọc
                </button>
            </div>

            <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
                {isLoading ? (
                    <div className="p-4 text-center text-sm text-gray-400">Đang tải...</div>
                ) : notifications.length === 0 ? (
                    <div className="p-8 text-center text-sm text-gray-400">Không có thông báo nào</div>
                ) : (
                    notifications.map((n) => (
                        <button
                            key={n.id}
                            onClick={() => handleClickItem(n)}
                            className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${!n.isRead ? "bg-blue-50/50" : ""}`}
                        >
                            <div className="flex items-start gap-3">
                                <span className="text-lg mt-0.5 flex-shrink-0">{TYPE_ICONS[n.type]}</span>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm ${!n.isRead ? "font-semibold text-gray-900" : "font-medium text-gray-700"} truncate`}>
                                        {n.title}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: vi })}
                                    </p>
                                </div>
                                {!n.isRead && (
                                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                                )}
                            </div>
                        </button>
                    ))
                )}
            </div>

            <div className="border-t border-gray-100 p-2">
                <button
                    onClick={() => { router.push("/user/notifications"); onClose(); }}
                    className="w-full text-center text-xs text-primary hover:underline py-1"
                >
                    Xem tất cả thông báo →
                </button>
            </div>
        </div>
    );
}
```

- [ ] **Step 2: Tạo `NotificationBell.tsx`**

```tsx
// src/components/Features/Notification/User/NotificationBell.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { useUnreadCount } from "@/hooks/data/user/useNotifications";
import NotificationDropdown from "./NotificationDropdown";

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const { data } = useUnreadCount();
    const count = data?.data?.count ?? 0;
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    return (
        <div ref={containerRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all active:scale-95"
                aria-label="Thông báo"
            >
                <BellIcon className="w-6 h-6" />
                {count > 0 && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                        {count > 99 ? "99+" : count}
                    </span>
                )}
            </button>
            {isOpen && <NotificationDropdown onClose={() => setIsOpen(false)} />}
        </div>
    );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Features/Notification/User/NotificationBell.tsx \
        src/components/Features/Notification/User/NotificationDropdown.tsx
git commit -m "feat: add NotificationBell and NotificationDropdown components"
```

---

## Task 5: Thêm NotificationBell vào PublicHeader

**Files:**
- Modify: `src/components/Layouts/Public/header/PublicHeader.tsx`

- [ ] **Step 1: Thêm import NotificationBell**

Thêm vào sau các heroicons import:
```tsx
import NotificationBell from "@/components/Features/Notification/User/NotificationBell";
```

- [ ] **Step 2: Thêm NotificationBell vào Action Buttons section**

Tìm đoạn:
```tsx
{/* Action Buttons */}
<div className="flex items-center gap-2 shrink-0">
  {/* Mobile Search Icon */}
```

Thêm `NotificationBell` sau search icon, chỉ khi `isAuthenticated`:

```tsx
{/* Action Buttons */}
<div className="flex items-center gap-2 shrink-0">
  {/* Mobile Search Icon */}
  {!pathname.startsWith("/posts") && !pathname.startsWith("/comics") && (
    <button
      className="lg:hidden p-3 rounded-full text-gray-500 hover:bg-gray-100 transition-all active:scale-95"
      onClick={() => setIsSearchOpen(!isSearchOpen)}
      aria-label={mounted ? (isSearchOpen ? "Close search" : "Open search") : "Open search"}
    >
      {isSearchOpen ? (
        <XMarkIcon className="w-6 h-6" />
      ) : (
        <MagnifyingGlassIcon className="w-6 h-6" />
      )}
    </button>
  )}

  {/* Notification Bell — chỉ hiện khi đã đăng nhập */}
  {mounted && isAuthenticated && <NotificationBell />}

  <button
    className="p-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all active:scale-95 z-[70]"
    onClick={handleToggle}
    aria-label={mounted ? (internalMobileMenuOpen ? "Close menu" : "Open menu") : "Open menu"}
  >
    <Bars3Icon className="w-7 h-7" />
  </button>
</div>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Layouts/Public/header/PublicHeader.tsx
git commit -m "feat: add NotificationBell to PublicHeader for authenticated users"
```

---

## Task 6: Tạo trang User Notifications

**Files:**
- Create: `src/components/Features/Notification/User/NotificationList.tsx`
- Create: `src/app/(user)/user/notifications/page.tsx`

- [ ] **Step 1: Tạo `NotificationList.tsx`**

```tsx
// src/components/Features/Notification/User/NotificationList.tsx
"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Notification, NotificationListParams, useNotifications, useMarkRead, useMarkAllRead } from "@/hooks/data/user/useNotifications";

const TYPE_ICONS: Record<Notification["type"], string> = {
    info: "ℹ️",
    success: "✅",
    warning: "⚠️",
    error: "❌",
};

const TYPE_COLORS: Record<Notification["type"], string> = {
    info: "border-l-blue-400",
    success: "border-l-green-400",
    warning: "border-l-yellow-400",
    error: "border-l-red-400",
};

export default function NotificationList() {
    const [filterType, setFilterType] = useState<string>("");
    const [filterRead, setFilterRead] = useState<string>("");
    const [page, setPage] = useState(1);

    const { data, isLoading, refetch } = useNotifications({
        page,
        limit: 20,
        ...(filterType ? { type: filterType as NotificationListParams["type"] } : {}),
        ...(filterRead !== "" ? { isRead: filterRead === "true" } : {}),
    });
    const { mutate: markRead } = useMarkRead();
    const { mutate: markAllRead, isPending: isMarkingAll } = useMarkAllRead();

    const notifications = data?.data ?? [];
    const meta = data?.meta;
    const totalPages = meta?.totalPages ?? 1;

    const handleMarkRead = (id: string) => {
        markRead(id, { onSuccess: () => refetch() });
    };

    const handleMarkAllRead = () => {
        markAllRead(undefined, { onSuccess: () => refetch() });
    };

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Thông báo của tôi</h1>
                <button
                    onClick={handleMarkAllRead}
                    disabled={isMarkingAll}
                    className="text-sm text-primary hover:underline disabled:opacity-50"
                >
                    Đánh dấu tất cả đã đọc
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-6">
                <select
                    value={filterType}
                    onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                    <option value="">Tất cả loại</option>
                    <option value="info">Thông tin</option>
                    <option value="success">Thành công</option>
                    <option value="warning">Cảnh báo</option>
                    <option value="error">Lỗi</option>
                </select>
                <select
                    value={filterRead}
                    onChange={(e) => { setFilterRead(e.target.value); setPage(1); }}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="false">Chưa đọc</option>
                    <option value="true">Đã đọc</option>
                </select>
            </div>

            {/* List */}
            {isLoading ? (
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : notifications.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <span className="text-5xl block mb-3">🔔</span>
                    <p>Không có thông báo nào</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((n) => (
                        <div
                            key={n.id}
                            className={`bg-white rounded-xl border border-gray-100 border-l-4 ${TYPE_COLORS[n.type]} shadow-sm p-4 ${!n.isRead ? "ring-1 ring-blue-100" : ""}`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                    <span className="text-xl flex-shrink-0 mt-0.5">{TYPE_ICONS[n.type]}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm ${!n.isRead ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>
                                            {n.title}
                                            {!n.isRead && (
                                                <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full align-middle" />
                                            )}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">{n.message}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: vi })}
                                        </p>
                                    </div>
                                </div>
                                {!n.isRead && (
                                    <button
                                        onClick={() => handleMarkRead(n.id)}
                                        className="text-xs text-blue-500 hover:underline flex-shrink-0"
                                    >
                                        Đánh dấu đọc
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <= 1}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
                    >
                        Trước
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-600">
                        {page} / {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
                    >
                        Sau
                    </button>
                </div>
            )}
        </div>
    );
}
```

- [ ] **Step 2: Tạo page `/user/notifications`**

```tsx
// src/app/(user)/user/notifications/page.tsx
import { Metadata } from "next";
import NotificationList from "@/components/Features/Notification/User/NotificationList";

export const metadata: Metadata = {
    title: "Thông báo của tôi",
};

export default function UserNotificationsPage() {
    return <NotificationList />;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Features/Notification/User/NotificationList.tsx \
        src/app/(user)/user/notifications/page.tsx
git commit -m "feat: add user notifications page with filtering and pagination"
```

---

## Task 7: Tạo Admin Notifications — NotificationListTab

**Files:**
- Create: `src/components/Features/Notification/Admin/NotificationListTab.tsx`

- [ ] **Step 1: Tạo `NotificationListTab.tsx`**

```tsx
// src/components/Features/Notification/Admin/NotificationListTab.tsx
"use client";

import { useState } from "react";
import { formatDate } from "@/utils";
import { useAdminNotificationList, useDeleteNotification } from "@/hooks/data/admin/useAdminNotifications";
import { Notification } from "@/hooks/data/user/useNotifications";
import SkeletonLoader from "@/components/UI/Feedback/SkeletonLoader";
import ConfirmModal from "@/components/UI/Feedback/ConfirmModal";
import Pagination from "@/components/UI/DataDisplay/Pagination";

const TYPE_BADGE: Record<Notification["type"], string> = {
    info: "bg-blue-100 text-blue-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    error: "bg-red-100 text-red-700",
};

const TYPE_LABELS: Record<string, string> = {
    info: "Thông tin",
    success: "Thành công",
    warning: "Cảnh báo",
    error: "Lỗi",
};

export default function NotificationListTab() {
    const [page, setPage] = useState(1);
    const [filterType, setFilterType] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterRead, setFilterRead] = useState("");

    const { data, isLoading, refetch } = useAdminNotificationList({
        page,
        limit: 20,
        ...(filterType ? { type: filterType } : {}),
        ...(filterStatus ? { status: filterStatus } : {}),
        ...(filterRead !== "" ? { isRead: filterRead === "true" } : {}),
    });
    const { mutate: deleteNotification, isPending: isDeleting } = useDeleteNotification();

    const notifications = data?.data ?? [];
    const meta = data?.meta;

    const [deleteTarget, setDeleteTarget] = useState<Notification | null>(null);

    const handleDeleteConfirm = () => {
        if (!deleteTarget) return;
        deleteNotification(deleteTarget.id, {
            onSuccess: () => {
                setDeleteTarget(null);
                refetch();
            },
        });
    };

    return (
        <div>
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
                <select
                    value={filterType}
                    onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                    <option value="">Tất cả loại</option>
                    <option value="info">Thông tin</option>
                    <option value="success">Thành công</option>
                    <option value="warning">Cảnh báo</option>
                    <option value="error">Lỗi</option>
                </select>
                <select
                    value={filterStatus}
                    onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="active">Đang hoạt động</option>
                    <option value="archived">Đã lưu trữ</option>
                    <option value="deleted">Đã xóa</option>
                </select>
                <select
                    value={filterRead}
                    onChange={(e) => { setFilterRead(e.target.value); setPage(1); }}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                    <option value="">Tất cả đọc/chưa đọc</option>
                    <option value="false">Chưa đọc</option>
                    <option value="true">Đã đọc</option>
                </select>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {isLoading ? (
                    <SkeletonLoader type="table" rows={10} columns={6} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tiêu đề</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Đã đọc</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {notifications.length > 0 ? notifications.map((n) => (
                                    <tr key={n.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-500">{n.userId}</td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900 max-w-xs truncate" title={n.title}>
                                            {n.title}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${TYPE_BADGE[n.type]}`}>
                                                {TYPE_LABELS[n.type] ?? n.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`w-2 h-2 rounded-full inline-block ${n.isRead ? "bg-green-400" : "bg-red-400"}`} />
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{formatDate(n.createdAt)}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => setDeleteTarget(n)}
                                                className="text-xs text-red-600 border border-red-200 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-10 text-center text-gray-400 italic">
                                            Không có thông báo nào
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {meta && meta.totalPages > 1 && (
                <Pagination
                    currentPage={meta.page}
                    totalPages={meta.totalPages}
                    totalItems={meta.total}
                    onPageChange={setPage}
                />
            )}

            {deleteTarget && (
                <ConfirmModal
                    show={true}
                    title="Xác nhận xóa"
                    message={`Bạn có chắc muốn xóa thông báo "${deleteTarget.title}"?`}
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={handleDeleteConfirm}
                />
            )}
        </div>
    );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Features/Notification/Admin/NotificationListTab.tsx
git commit -m "feat: add admin notification list tab with filters and delete"
```

---

## Task 8: Tạo SendNotificationForm

**Files:**
- Create: `src/components/Features/Notification/Admin/SendNotificationForm.tsx`

- [ ] **Step 1: Tạo component**

```tsx
// src/components/Features/Notification/Admin/SendNotificationForm.tsx
"use client";

import { useState } from "react";
import { useSendNotification } from "@/hooks/data/admin/useAdminNotifications";

export default function SendNotificationForm() {
    const [userIdsText, setUserIdsText] = useState("");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [type, setType] = useState<"info" | "success" | "warning" | "error">("info");

    const { mutate: sendNotification, isPending } = useSendNotification();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Parse userIds từ textarea (mỗi dòng 1 ID, bỏ dòng rỗng)
        const userIds = userIdsText
            .split("\n")
            .map((id) => id.trim())
            .filter((id) => id.length > 0 && /^\d+$/.test(id));

        if (userIds.length === 0) return;

        sendNotification(
            { userIds, title: title.trim(), message: message.trim(), type },
            {
                onSuccess: () => {
                    setUserIdsText("");
                    setTitle("");
                    setMessage("");
                    setType("info");
                },
            }
        );
    };

    const userIds = userIdsText
        .split("\n")
        .map((id) => id.trim())
        .filter((id) => id.length > 0 && /^\d+$/.test(id));

    return (
        <div className="max-w-2xl">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Danh sách User ID <span className="text-red-500">*</span>
                        <span className="ml-2 text-xs text-gray-400 font-normal">Mỗi dòng một ID số (tối đa 500)</span>
                    </label>
                    <textarea
                        value={userIdsText}
                        onChange={(e) => setUserIdsText(e.target.value)}
                        rows={6}
                        required
                        placeholder={"1001\n1002\n1003"}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        Đã nhập: <strong>{userIds.length}</strong> ID hợp lệ
                        {userIds.length > 500 && (
                            <span className="text-red-500 ml-2">Tối đa 500 ID</span>
                        )}
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tiêu đề <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={255}
                        required
                        placeholder="Nhập tiêu đề thông báo..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nội dung <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        maxLength={5000}
                        required
                        placeholder="Nhập nội dung thông báo..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                    />
                    <p className="text-xs text-gray-400 mt-1 text-right">{message.length}/5.000</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại thông báo</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value as typeof type)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                        <option value="info">ℹ️ Thông tin</option>
                        <option value="success">✅ Thành công</option>
                        <option value="warning">⚠️ Cảnh báo</option>
                        <option value="error">❌ Lỗi</option>
                    </select>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isPending || userIds.length === 0 || userIds.length > 500 || !title.trim() || !message.trim()}
                        className="px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isPending ? "Đang gửi..." : `Gửi thông báo đến ${userIds.length} người`}
                    </button>
                </div>
            </form>
        </div>
    );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Features/Notification/Admin/SendNotificationForm.tsx
git commit -m "feat: add SendNotificationForm for bulk notification dispatch"
```

---

## Task 9: Tạo AdminNotifications và trang admin

**Files:**
- Create: `src/components/Features/Notification/Admin/AdminNotifications.tsx`
- Create: `src/app/(admin)/admin/notifications/page.tsx`

- [ ] **Step 1: Tạo `AdminNotifications.tsx`**

```tsx
// src/components/Features/Notification/Admin/AdminNotifications.tsx
"use client";

import { useState } from "react";
import NotificationListTab from "./NotificationListTab";
import SendNotificationForm from "./SendNotificationForm";

type Tab = "list" | "send";

export default function AdminNotifications() {
    const [activeTab, setActiveTab] = useState<Tab>("list");

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý Thông báo</h1>
            </div>

            <div className="border-b border-gray-200 mb-6">
                <nav className="flex gap-0" aria-label="Tabs">
                    {([["list", "Danh sách thông báo"], ["send", "Gửi thông báo"]] as [Tab, string][]).map(([tab, label]) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === tab
                                    ? "border-primary text-primary"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </nav>
            </div>

            {activeTab === "list" && <NotificationListTab />}
            {activeTab === "send" && <SendNotificationForm />}
        </div>
    );
}
```

- [ ] **Step 2: Tạo page `/admin/notifications`**

```tsx
// src/app/(admin)/admin/notifications/page.tsx
import AdminNotifications from "@/components/Features/Notification/Admin/AdminNotifications";

export default function AdminNotificationsPage() {
    return <AdminNotifications />;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Features/Notification/Admin/AdminNotifications.tsx \
        src/app/(admin)/admin/notifications/page.tsx
git commit -m "feat: add AdminNotifications page with list and send tabs"
```

---

## Task 10: Kiểm tra build

- [ ] **Step 1: Chạy TypeScript check**

```bash
npx tsc --noEmit
```

Expected: không có errors. Nếu có lỗi, fix trước khi tiếp tục.

- [ ] **Step 2: Chạy build**

```bash
npm run build
```

Expected: build thành công, không có errors. Warnings về `date-fns` locale là bình thường.

- [ ] **Step 3: Nếu `date-fns` chưa có, cài thêm**

Kiểm tra xem `date-fns` đã có trong package.json chưa:
```bash
cat package.json | grep date-fns
```

Nếu chưa có:
```bash
npm install date-fns
```

Sau đó chạy lại `npm run build`.

- [ ] **Step 4: Commit cuối nếu có thay đổi package**

```bash
git add package.json package-lock.json
git commit -m "chore: add date-fns dependency for relative time formatting"
```

---

*Kết thúc PR 2.*
