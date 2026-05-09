type Id = string | number;

export const postTagEndpoints = {
    public: {
        list: "/api/public/post-tags",
        showBySlug: (slug: string) => `/api/public/post-tags/${slug}`,
    },
    admin: {
        list: "/api/admin/post-tags",
        create: "/api/admin/post-tags",
        show: (id: Id) => `/api/admin/post-tags/${id}`,
        update: (id: Id) => `/api/admin/post-tags/${id}`,
        delete: (id: Id) => `/api/admin/post-tags/${id}`,
    },
} as const;
