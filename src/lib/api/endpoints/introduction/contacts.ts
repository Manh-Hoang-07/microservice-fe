type Id = string | number;

export const contactEndpoints = {
    public: {
        create: "/api/public/contacts",
    },
    admin: {
        list: "/api/admin/contacts",
        create: "/api/admin/contacts",
        show: (id: Id) => `/api/admin/contacts/${id}`,
        update: (id: Id) => `/api/admin/contacts/${id}`,
        delete: (id: Id) => `/api/admin/contacts/${id}`,
        reply: (id: Id) => `/api/admin/contacts/${id}/reply`,
        markAsRead: (id: Id) => `/api/admin/contacts/${id}/read`,
        close: (id: Id) => `/api/admin/contacts/${id}/close`,
    },
} as const;
