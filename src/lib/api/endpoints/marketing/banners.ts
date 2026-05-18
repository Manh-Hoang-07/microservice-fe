type Id = string | number;

export const bannerEndpoints = {
    public: {
        list: "/api/cms/public/banners",
        show: (id: Id) => `/api/cms/public/banners/${id}`,
        getByLocation: (locationCode: string) => `/api/cms/public/banners/location/${locationCode}`,
    },
    admin: {
        list: "/api/cms/admin/banners",
        create: "/api/cms/admin/banners",
        show: (id: Id) => `/api/cms/admin/banners/${id}`,
        update: (id: Id) => `/api/cms/admin/banners/${id}`,
        delete: (id: Id) => `/api/cms/admin/banners/${id}`,
        updateStatus: (id: Id) => `/api/cms/admin/banners/${id}/status`,
        updateSortOrder: (id: Id) => `/api/cms/admin/banners/${id}/sort-order`,
        restore: (id: Id) => `/api/cms/admin/banners/${id}/restore`,
        getByLocation: (locationCode: string) => `/api/cms/admin/banners/location/${locationCode}`,
    },
} as const;
