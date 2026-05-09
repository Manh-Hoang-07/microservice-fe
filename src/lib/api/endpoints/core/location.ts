type Id = string | number;

export const locationEndpoints = {
    public: {
        countries: "/api/config/countries",
        provinces: "/api/config/provinces",
        wards: "/api/config/wards",
        provincesByCountry: (countryId: Id) => `/api/config/countries/${countryId}/provinces`,
        wardsByProvince: (provinceId: Id) => `/api/config/provinces/${provinceId}/wards`,
    },
    admin: {
        countries: {
            list: "/api/config/admin/countries",
            simple: "/api/config/admin/countries/simple",
            create: "/api/config/admin/countries",
            show: (id: Id) => `/api/config/admin/countries/${id}`,
            update: (id: Id) => `/api/config/admin/countries/${id}`,
            delete: (id: Id) => `/api/config/admin/countries/${id}`,
        },
        provinces: {
            list: "/api/config/admin/provinces",
            simple: "/api/config/admin/provinces/simple",
            create: "/api/config/admin/provinces",
            show: (id: Id) => `/api/config/admin/provinces/${id}`,
            update: (id: Id) => `/api/config/admin/provinces/${id}`,
            delete: (id: Id) => `/api/config/admin/provinces/${id}`,
        },
        wards: {
            list: "/api/config/admin/wards",
            simple: "/api/config/admin/wards/simple",
            create: "/api/config/admin/wards",
            show: (id: Id) => `/api/config/admin/wards/${id}`,
            update: (id: Id) => `/api/config/admin/wards/${id}`,
            delete: (id: Id) => `/api/config/admin/wards/${id}`,
        },
    },
} as const;
