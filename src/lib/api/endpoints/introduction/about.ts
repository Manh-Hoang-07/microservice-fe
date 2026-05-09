type Id = string | number;

export const aboutEndpoints = {
    public: {
        list: "/api/about-sections",
        showBySlug: (slug: string) => `/api/about-sections/${slug}`,
        getByType: (type: string) => `/api/about-sections/type/${type}`,
    },
    admin: {
        list: "/api/admin/about-sections",
        create: "/api/admin/about-sections",
        show: (id: Id) => `/api/admin/about-sections/${id}`,
        update: (id: Id) => `/api/admin/about-sections/${id}`,
        delete: (id: Id) => `/api/admin/about-sections/${id}`,
    },
} as const;
