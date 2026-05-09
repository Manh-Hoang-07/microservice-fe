type Id = string | number;

export const postCategoryEndpoints = {
    public: {
        list: "/api/public/post-categories",
        showBySlug: (slug: string) => `/api/public/post-categories/${slug}`,
    },
    admin: {
        list: "/api/admin/post-categories",
        create: "/api/admin/post-categories",
        show: (id: Id) => `/api/admin/post-categories/${id}`,
        update: (id: Id) => `/api/admin/post-categories/${id}`,
        delete: (id: Id) => `/api/admin/post-categories/${id}`,
    },
} as const;
