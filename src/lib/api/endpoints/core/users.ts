type Id = string | number;

export const userManagementEndpoints = {
    admin: {
        list: "/api/auth/admin/users",
        simple: "/api/auth/admin/users/simple",
        create: "/api/auth/admin/users",
        show: (id: Id) => `/api/auth/admin/users/${id}`,
        update: (id: Id) => `/api/auth/admin/users/${id}`,
        delete: (id: Id) => `/api/auth/admin/users/${id}`,
        changePassword: (id: Id) => `/api/auth/admin/users/${id}/password`,
        changeStatus: (id: Id) => `/api/auth/admin/users/${id}/status`,
        enumStatuses: "/api/auth/users/enums/statuses",
        enumGenders: "/api/auth/users/enums/genders",
        // Role assignment — IAM admin endpoints (global, no groupId)
        roles: (id: Id) => `/api/iam/admin/users/${id}/roles`,
        assignRole: (id: Id) => `/api/iam/admin/users/${id}/roles`,
        deleteRole: (id: Id, roleId: Id) => `/api/iam/admin/users/${id}/roles/${roleId}`,
        rolesSync: (id: Id) => `/api/iam/admin/users/${id}/roles/sync`,
    },
} as const;
