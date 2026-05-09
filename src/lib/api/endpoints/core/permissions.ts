type Id = string | number;

export const permissionEndpoints = {
    admin: {
        list: "/api/admin/permissions",
        simple: "/api/admin/permissions/simple",
        create: "/api/admin/permissions",
        show: (id: Id) => `/api/admin/permissions/${id}`,
        update: (id: Id) => `/api/admin/permissions/${id}`,
        delete: (id: Id) => `/api/admin/permissions/${id}`,
    },
} as const;
