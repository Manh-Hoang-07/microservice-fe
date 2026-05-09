type Id = string | number;

export const certificateEndpoints = {
    public: {
        list: "/api/certificates",
        show: (id: Id) => `/api/certificates/${id}`,
        getByType: (type: string) => `/api/certificates/type/${type}`,
    },
    admin: {
        list: "/api/admin/certificates",
        create: "/api/admin/certificates",
        show: (id: Id) => `/api/admin/certificates/${id}`,
        update: (id: Id) => `/api/admin/certificates/${id}`,
        delete: (id: Id) => `/api/admin/certificates/${id}`,
    },
} as const;
