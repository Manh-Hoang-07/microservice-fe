type Id = string | number;

export const postEndpoints = {
    public: {
        list: "/api/posts/public/posts",
        showBySlug: (slug: string) => `/api/posts/public/posts/${slug}`,
        comments: "/api/posts/public/post-comments",
    },
    admin: {
        list: "/api/posts/admin/posts",
        simple: "/api/posts/admin/posts/simple",
        create: "/api/posts/admin/posts",
        show: (id: Id) => `/api/posts/admin/posts/${id}`,
        update: (id: Id) => `/api/posts/admin/posts/${id}`,
        delete: (id: Id) => `/api/posts/admin/posts/${id}`,
        overview: "/api/posts/admin/posts/statistics/overview",
        stats: (id: Id) => `/api/posts/admin/posts/${id}/stats`,
    },
} as const;
