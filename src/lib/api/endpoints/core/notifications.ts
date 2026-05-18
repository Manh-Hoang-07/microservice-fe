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
