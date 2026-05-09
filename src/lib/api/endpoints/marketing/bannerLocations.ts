type Id = string | number;

export const bannerLocationEndpoints = {
    admin: {
        list: "/api/admin/banner-locations",
        create: "/api/admin/banner-locations",
        show: (id: Id) => `/api/admin/banner-locations/${id}`,
        update: (id: Id) => `/api/admin/banner-locations/${id}`,
        delete: (id: Id) => `/api/admin/banner-locations/${id}`,
        updateStatus: (id: Id) => `/api/admin/banner-locations/${id}/status`,
        restore: (id: Id) => `/api/admin/banner-locations/${id}/restore`,
        getByCode: (code: string) => `/api/admin/banner-locations/code/${code}`,
    },
} as const;
