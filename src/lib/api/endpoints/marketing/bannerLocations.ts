type Id = string | number;

export const bannerLocationEndpoints = {
    admin: {
        list: "/api/cms/admin/banner-locations",
        create: "/api/cms/admin/banner-locations",
        show: (id: Id) => `/api/cms/admin/banner-locations/${id}`,
        update: (id: Id) => `/api/cms/admin/banner-locations/${id}`,
        delete: (id: Id) => `/api/cms/admin/banner-locations/${id}`,
        updateStatus: (id: Id) => `/api/cms/admin/banner-locations/${id}/status`,
        restore: (id: Id) => `/api/cms/admin/banner-locations/${id}/restore`,
        getByCode: (code: string) => `/api/cms/admin/banner-locations/code/${code}`,
    },
} as const;
