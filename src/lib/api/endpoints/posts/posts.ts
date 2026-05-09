type Id = string | number;

export const postEndpoints = {
    public: {
        list: "/api/public/posts",
        featured: "/api/public/posts/featured",
        showBySlug: (slug: string) => `/api/public/posts/${slug}`,
        comments: (postId: Id) => `/api/public/posts/${postId}/comments`,
    },
    admin: {
        list: "/api/admin/posts",
        create: "/api/admin/posts",
        show: (id: Id) => `/api/admin/posts/${id}`,
        update: (id: Id) => `/api/admin/posts/${id}`,
        delete: (id: Id) => `/api/admin/posts/${id}`,
        stats: (id: Id) => `/api/admin/posts/${id}/stats`,
        overview: "/api/admin/posts/statistics/overview",
    },
} as const;
