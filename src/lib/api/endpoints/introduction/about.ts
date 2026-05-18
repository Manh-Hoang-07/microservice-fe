// src/lib/api/endpoints/introduction/about.ts
type Id = string | number;

export const aboutEndpoints = {
    public: {
        list: "/api/cms/public/about-sections",
        showBySlug: (slug: string) => `/api/cms/public/about-sections/${slug}`,
        getByType: (type: string) => `/api/cms/public/about-sections/type/${type}`,
    },
    admin: {
        list: "/api/cms/admin/about-sections",
        create: "/api/cms/admin/about-sections",
        show: (id: Id) => `/api/cms/admin/about-sections/${id}`,
        update: (id: Id) => `/api/cms/admin/about-sections/${id}`,
        delete: (id: Id) => `/api/cms/admin/about-sections/${id}`,
    },
} as const;
