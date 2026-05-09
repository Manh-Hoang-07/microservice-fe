type Id = string | number;

export const contextEndpoints = {
    admin: {
        list: "/api/admin/contexts",
        create: "/api/admin/contexts",
        show: (id: Id) => `/api/admin/contexts/${id}`,
        update: (id: Id) => `/api/admin/contexts/${id}`,
        delete: (id: Id) => `/api/admin/contexts/${id}`,
    },
} as const;
