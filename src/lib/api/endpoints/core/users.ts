type Id = string | number;

export const userManagementEndpoints = {
    admin: {
        list: "/api/admin/users",
        create: "/api/admin/users",
        show: (id: Id) => `/api/admin/users/${id}`,
        update: (id: Id) => `/api/admin/users/${id}`,
        delete: (id: Id) => `/api/admin/users/${id}`,
        changePassword: (id: Id) => `/api/admin/users/${id}/password`,
        assignRoles: (id: Id) => `/api/admin/users/${id}/roles`,
        rolesBatch: (id: Id) => `/api/admin/users/${id}/roles/batch`,
        rolesTree: (id: Id) => `/api/admin/users/${id}/roles/tree`,
        rolesByGroups: (id: Id) => `/api/admin/users/${id}/roles`,
    },
} as const;
