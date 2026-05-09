type Id = string | number;

export const contentTemplateEndpoints = {
    admin: {
        list: "/api/admin/content-templates",
        create: "/api/admin/content-templates",
        show: (id: Id) => `/api/admin/content-templates/${id}`,
        update: (id: Id) => `/api/admin/content-templates/${id}`,
        delete: (id: Id) => `/api/admin/content-templates/${id}`,
        test: (id: Id) => `/api/admin/content-templates/${id}/test`,
    },
} as const;
