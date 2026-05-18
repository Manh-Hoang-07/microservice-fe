"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store/authStore";
import { useToastContext } from "@/lib/toast";
import { api } from "@/lib/api/client";
import { notificationEndpoints } from "@/lib/api/endpoints/core/notifications";

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

export interface NotificationListParams {
    page?: number;
    limit?: number;
    type?: string;
    isRead?: boolean;
}

export function useNotifications(params?: NotificationListParams) {
    const { isAuthenticated } = useAuthStore();
    const hasToken =
        typeof window !== "undefined" && document.cookie.includes("auth_token");

    const { data, isLoading } = useQuery({
        queryKey: ["notifications", params],
        queryFn: () => api.get(notificationEndpoints.user.list, { params }),
        enabled: isAuthenticated && hasToken,
    });

    const notifications: Notification[] = data?.data?.data ?? [];
    const pagination = data?.data?.pagination;

    return {
        notifications,
        isLoading,
        total: pagination?.total ?? 0,
        page: pagination?.page ?? 1,
        limit: pagination?.limit ?? 10,
    };
}

export function useUnreadCount() {
    const { isAuthenticated } = useAuthStore();
    const hasToken =
        typeof window !== "undefined" && document.cookie.includes("auth_token");

    const { data } = useQuery({
        queryKey: ["notifications", "unreadCount"],
        queryFn: () => api.get(notificationEndpoints.user.unreadCount),
        enabled: isAuthenticated && hasToken,
        refetchInterval: 60 * 1000,
    });

    return {
        count: data?.data?.count ?? 0,
    };
}

export function useMarkRead() {
    const queryClient = useQueryClient();

    const { mutate: markRead, isPending: isLoading } = useMutation({
        mutationFn: (id: string) =>
            api.patch(notificationEndpoints.user.markRead(id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

    return { markRead, isLoading };
}

export function useMarkAllRead() {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToastContext();

    const { mutate: markAllRead, isPending: isLoading } = useMutation({
        mutationFn: () => api.patch(notificationEndpoints.user.markAllRead),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            showSuccess("Đã đánh dấu tất cả đã đọc");
        },
        onError: () => showError("Không thể thực hiện thao tác"),
    });

    return { markAllRead, isLoading };
}
