type Id = string | number;

export const groupEndpoints = {
    user: {
        list: "/api/iam/user/groups",
    },
    admin: {
        list: "/api/iam/admin/groups",
        create: "/api/iam/admin/groups",
        show: (id: Id) => `/api/iam/admin/groups/${id}`,
        update: (id: Id) => `/api/iam/admin/groups/${id}`,
        delete: (id: Id) => `/api/iam/admin/groups/${id}`,
        members: {
            list: (groupId: Id) => `/api/iam/admin/groups/${groupId}/members`,
            add: (groupId: Id) => `/api/iam/admin/groups/${groupId}/members`,
            remove: (groupId: Id, memberId: Id) => `/api/iam/admin/groups/${groupId}/members/${memberId}`,
        },
    },
} as const;
