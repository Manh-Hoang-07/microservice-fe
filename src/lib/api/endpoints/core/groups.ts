type Id = string | number;

export const groupEndpoints = {
    user: {
        list: "/api/user/groups",
    },
    admin: {
        list: "/api/admin/groups",
        create: "/api/admin/groups",
        show: (id: Id) => `/api/admin/groups/${id}`,
        update: (id: Id) => `/api/admin/groups/${id}`,
        delete: (id: Id) => `/api/admin/groups/${id}`,
        members: {
            list: (groupId: Id) => `/api/groups/${groupId}/members`,
            add: (groupId: Id) => `/api/groups/${groupId}/members`,
            updateRoles: (groupId: Id, memberId: Id) => `/api/groups/${groupId}/members/${memberId}/roles`,
            remove: (groupId: Id, memberId: Id) => `/api/groups/${groupId}/members/${memberId}`,
        },
    },
} as const;
