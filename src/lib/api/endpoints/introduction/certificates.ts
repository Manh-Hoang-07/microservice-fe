// src/lib/api/endpoints/introduction/certificates.ts
type Id = string | number;

export const certificateEndpoints = {
    public: {
        list: "/api/cms/public/certificates",
        show: (id: Id) => `/api/cms/public/certificates/${id}`,
        getByType: (type: string) => `/api/cms/public/certificates/type/${type}`,
    },
    admin: {
        list: "/api/cms/admin/certificates",
        create: "/api/cms/admin/certificates",
        show: (id: Id) => `/api/cms/admin/certificates/${id}`,
        update: (id: Id) => `/api/cms/admin/certificates/${id}`,
        delete: (id: Id) => `/api/cms/admin/certificates/${id}`,
    },
} as const;
