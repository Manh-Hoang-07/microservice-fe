"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { notificationEndpoints } from "@/lib/api/endpoints/core/notifications";
import { useToastContext } from "@/lib/toast";

export interface AdminNotification {
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

export interface AdminNotificationListParams {
    page?: number;
    limit?: number;
    userId?: string;
    type?: string;
    status?: string;
    isRead?: boolean;
}

export interface SendNotificationPayload {
    userIds: string[];
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
}

export function useAdminNotificationList(params?: AdminNotificationListParams) {
    const { data, isLoading } = useQuery({
        queryKey: ["admin", "notifications", params],
        queryFn: () => api.get(notificationEndpoints.admin.list, { params }),
    });

    const notifications: AdminNotification[] = data?.data?.data ?? [];
    const pagination = data?.data?.pagination;
    const total: number = pagination?.total ?? 0;
    const page: number = pagination?.page ?? 1;
    const limit: number = pagination?.limit ?? 10;

    return { notifications, isLoading, total, page, limit };
}

export function useSendNotification() {
    const { showSuccess, showError } = useToastContext();

    const { mutate: sendNotification, isPending } = useMutation({
        mutationFn: (payload: SendNotificationPayload) =>
            api.post(notificationEndpoints.admin.send, payload),
        onSuccess: () => {
            showSuccess("Đã gửi thông báo thành công");
        },
        onError: () => {
            showError("Không thể gửi thông báo");
        },
    });

    return { sendNotification, isPending };
}

export function useDeleteNotification() {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useToastContext();

    const { mutate: deleteNotification, isPending } = useMutation({
        mutationFn: (id: string) =>
            api.delete(notificationEndpoints.admin.delete(id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });
            showSuccess("Đã xóa thông báo");
        },
        onError: () => {
            showError("Không thể xóa thông báo");
        },
    });

    return { deleteNotification, isPending };
}
