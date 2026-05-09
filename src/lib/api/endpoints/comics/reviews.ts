type Id = string | number;

export const comicReviewEndpoints = {
    public: {
        comic: (comicId: Id) => `/api/public/reviews/comics/${comicId}`,
    },
    user: {
        list: "/api/user/reviews",
        comic: (comicId: Id) => `/api/user/reviews/comic/${comicId}`,
    },
    admin: {
        list: "/api/admin/reviews",
        create: "/api/admin/reviews",
        statistics: "/api/admin/reviews/statistics",
        show: (id: Id) => `/api/admin/reviews/${id}`,
        update: (id: Id) => `/api/admin/reviews/${id}`,
        delete: (id: Id) => `/api/admin/reviews/${id}`,
    },
} as const;
