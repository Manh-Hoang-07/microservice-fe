type Id = string | number;

export const roleEndpoints = {
    admin: {
        list: "/api/iam/admin/roles",
        create: "/api/iam/admin/roles",
        show: (id: Id) => `/api/iam/admin/roles/${id}`,
        update: (id: Id) => `/api/iam/admin/roles/${id}`,
        delete: (id: Id) => `/api/iam/admin/roles/${id}`,
        assignPermissions: (id: Id) => `/api/iam/admin/roles/${id}/permissions`,
    },
} as const;
