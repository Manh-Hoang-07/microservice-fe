type Id = string | number;

export const contentTemplateEndpoints = {
    admin: {
        list: "/api/notifications/admin/content-templates",
        create: "/api/notifications/admin/content-templates",
        show: (id: Id) => `/api/notifications/admin/content-templates/${id}`,
        update: (id: Id) => `/api/notifications/admin/content-templates/${id}`,
        delete: (id: Id) => `/api/notifications/admin/content-templates/${id}`,
        test: (id: Id) => `/api/notifications/admin/content-templates/${id}/test`,
    },
} as const;
