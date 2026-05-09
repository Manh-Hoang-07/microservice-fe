type Id = string | number;

export const partnerEndpoints = {
    public: {
        list: "/api/partners",
        getByType: (type: string) => `/api/partners/type/${type}`,
    },
    admin: {
        list: "/api/admin/partners",
        create: "/api/admin/partners",
        show: (id: Id) => `/api/admin/partners/${id}`,
        update: (id: Id) => `/api/admin/partners/${id}`,
        delete: (id: Id) => `/api/admin/partners/${id}`,
    },
} as const;
