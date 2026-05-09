type Id = string | number;

export const roleEndpoints = {
    admin: {
        list: "/api/admin/roles",
        simple: "/api/admin/roles/simple",
        create: "/api/admin/roles",
        show: (id: Id) => `/api/admin/roles/${id}`,
        update: (id: Id) => `/api/admin/roles/${id}`,
        delete: (id: Id) => `/api/admin/roles/${id}`,
        assignPermissions: (id: Id) => `/api/admin/roles/${id}/permissions`,
    },
} as const;
