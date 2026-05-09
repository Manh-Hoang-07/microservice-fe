type Id = string | number;

export const postCommentEndpoints = {
    admin: {
        list: "/api/admin/post-comments",
        updateStatus: (id: Id) => `/api/admin/post-comments/${id}/status`,
        delete: (id: Id) => `/api/admin/post-comments/${id}`,
    },
} as const;
