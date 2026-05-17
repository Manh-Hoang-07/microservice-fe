type Id = string | number;

export const permissionEndpoints = {
    admin: {
        list: "/api/iam/admin/permissions",
        simple: "/api/iam/admin/permissions/simple",
        create: "/api/iam/admin/permissions",
        show: (id: Id) => `/api/iam/admin/permissions/${id}`,
        update: (id: Id) => `/api/iam/admin/permissions/${id}`,
        delete: (id: Id) => `/api/iam/admin/permissions/${id}`,
    },
} as const;
