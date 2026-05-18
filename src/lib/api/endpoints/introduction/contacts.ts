// src/lib/api/endpoints/introduction/contacts.ts
type Id = string | number;

export const contactEndpoints = {
    public: {
        create: "/api/cms/public/contacts",
    },
    admin: {
        list: "/api/cms/admin/contacts",
        create: "/api/cms/admin/contacts",
        show: (id: Id) => `/api/cms/admin/contacts/${id}`,
        update: (id: Id) => `/api/cms/admin/contacts/${id}`,
        delete: (id: Id) => `/api/cms/admin/contacts/${id}`,
        reply: (id: Id) => `/api/cms/admin/contacts/${id}/reply`,
        markAsRead: (id: Id) => `/api/cms/admin/contacts/${id}/read`,
        close: (id: Id) => `/api/cms/admin/contacts/${id}/close`,
    },
} as const;
