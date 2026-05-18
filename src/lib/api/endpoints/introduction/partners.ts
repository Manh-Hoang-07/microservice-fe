type Id = string | number;

export const partnerEndpoints = {
    public: {
        list: "/api/cms/public/partners",
        getByType: (type: string) => `/api/cms/public/partners/type/${type}`,
    },
    admin: {
        list: "/api/cms/admin/partners",
        create: "/api/cms/admin/partners",
        show: (id: Id) => `/api/cms/admin/partners/${id}`,
        update: (id: Id) => `/api/cms/admin/partners/${id}`,
        delete: (id: Id) => `/api/cms/admin/partners/${id}`,
    },
} as const;
