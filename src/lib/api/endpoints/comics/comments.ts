type Id = string | number;

export const comicCommentEndpoints = {
    public: {
        comic: (comicId: Id) => `/api/public/comic-comments/comics/${comicId}`,
        chapter: (chapterId: Id) => `/api/public/comic-comments/chapters/${chapterId}`,
    },
    user: {
        list: "/api/user/comic-comments",
        create: "/api/user/comic-comments",
        update: (id: Id) => `/api/user/comic-comments/${id}`,
        delete: (id: Id) => `/api/user/comic-comments/${id}`,
    },
    admin: {
        list: "/api/admin/comic-comments",
        statistics: "/api/admin/comic-comments/statistics",
        update: (id: Id) => `/api/admin/comic-comments/${id}`,
        delete: (id: Id) => `/api/admin/comic-comments/${id}`,
        updateStatus: (id: Id) => `/api/admin/comic-comments/${id}/status`,
    },
} as const;
