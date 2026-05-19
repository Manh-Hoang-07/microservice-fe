type Id = string | number;

export const postCategoryEndpoints = {
    public: {
        list: "/api/posts/public/post-categories",
    },
    admin: {
        list: "/api/posts/admin/post-categories",
        create: "/api/posts/admin/post-categories",
        show: (id: Id) => `/api/posts/admin/post-categories/${id}`,
        update: (id: Id) => `/api/posts/admin/post-categories/${id}`,
        delete: (id: Id) => `/api/posts/admin/post-categories/${id}`,
    },
} as const;
