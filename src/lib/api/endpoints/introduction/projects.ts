type Id = string | number;

export const projectEndpoints = {
    public: {
        list: "/api/projects",
        featured: "/api/projects/featured",
        showBySlug: (slug: string) => `/api/projects/${slug}`,
    },
    admin: {
        list: "/api/admin/projects",
        create: "/api/admin/projects",
        show: (id: Id) => `/api/admin/projects/${id}`,
        update: (id: Id) => `/api/admin/projects/${id}`,
        delete: (id: Id) => `/api/admin/projects/${id}`,
    },
} as const;
