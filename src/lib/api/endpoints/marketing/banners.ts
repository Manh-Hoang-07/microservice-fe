type Id = string | number;

export const bannerEndpoints = {
    public: {
        list: "/api/public/banners",
        show: (id: Id) => `/api/public/banners/${id}`,
        getByLocation: (locationCode: string) => `/api/public/banners/location/${locationCode}`,
    },
    admin: {
        list: "/api/admin/banners",
        create: "/api/admin/banners",
        show: (id: Id) => `/api/admin/banners/${id}`,
        update: (id: Id) => `/api/admin/banners/${id}`,
        delete: (id: Id) => `/api/admin/banners/${id}`,
        updateStatus: (id: Id) => `/api/admin/banners/${id}/status`,
        updateSortOrder: (id: Id) => `/api/admin/banners/${id}/sort-order`,
        restore: (id: Id) => `/api/admin/banners/${id}/restore`,
        getByLocation: (locationCode: string) => `/api/admin/banners/location/${locationCode}`,
    },
} as const;
