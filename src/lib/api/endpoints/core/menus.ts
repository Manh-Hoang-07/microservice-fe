type Id = string | number;

export const menuEndpoints = {
    public: {
        list: "/api/config/menus",
    },
    user: {
        list: "/api/config/user/menus",
    },
    admin: {
        list: "/api/config/admin/menus",
        tree: "/api/config/admin/menus/tree",
        create: "/api/config/admin/menus",
        show: (id: Id) => `/api/config/admin/menus/${id}`,
        update: (id: Id) => `/api/config/admin/menus/${id}`,
        delete: (id: Id) => `/api/config/admin/menus/${id}`,
        permissions: "/api/config/admin/permissions",
        enumTypes: "/api/config/menus/enums/types",
        enumStatuses: "/api/config/menus/enums/statuses",
        enumGroups: "/api/config/menus/enums/groups",
    },
} as const;
