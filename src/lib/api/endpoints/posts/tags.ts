type Id = string | number;

export const postTagEndpoints = {
    public: {
        list: "/api/posts/public/post-tags",
    },
    admin: {
        list: "/api/posts/admin/post-tags",
        create: "/api/posts/admin/post-tags",
        show: (id: Id) => `/api/posts/admin/post-tags/${id}`,
        update: (id: Id) => `/api/posts/admin/post-tags/${id}`,
        delete: (id: Id) => `/api/posts/admin/post-tags/${id}`,
    },
} as const;
