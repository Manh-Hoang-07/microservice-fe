type Id = string | number;

export const menuEndpoints = {
    public: {
        list: "/api/config/menus",
    },
    user: {
        list: "/api/config/menus/user",
    },
    admin: {
        list: "/api/config/menus/admin",
        tree: "/api/config/menus/admin/tree",
        create: "/api/config/menus",
        show: (id: Id) => `/api/config/menus/admin/${id}`,
        update: (id: Id) => `/api/config/menus/${id}`,
        delete: (id: Id) => `/api/config/menus/${id}`,
        userList: "/api/config/menus/user",
    },
} as const;
