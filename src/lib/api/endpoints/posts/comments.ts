type Id = string | number;

export const postCommentEndpoints = {
    public: {
        list: "/api/posts/public/post-comments",
    },
    user: {
        create: "/api/posts/user/post-comments",
        update: (id: Id) => `/api/posts/user/post-comments/${id}`,
        delete: (id: Id) => `/api/posts/user/post-comments/${id}`,
    },
    admin: {
        list: "/api/posts/admin/post-comments",
        update: (id: Id) => `/api/posts/admin/post-comments/${id}`,
        delete: (id: Id) => `/api/posts/admin/post-comments/${id}`,
    },
} as const;
