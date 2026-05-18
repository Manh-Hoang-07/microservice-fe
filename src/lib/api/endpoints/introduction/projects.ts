type Id = string | number;

export const projectEndpoints = {
    public: {
        list: "/api/cms/public/projects",
        featured: "/api/cms/public/projects/featured",
        showBySlug: (slug: string) => `/api/cms/public/projects/${slug}`,
    },
    admin: {
        list: "/api/cms/admin/projects",
        create: "/api/cms/admin/projects",
        show: (id: Id) => `/api/cms/admin/projects/${id}`,
        update: (id: Id) => `/api/cms/admin/projects/${id}`,
        delete: (id: Id) => `/api/cms/admin/projects/${id}`,
    },
} as const;
