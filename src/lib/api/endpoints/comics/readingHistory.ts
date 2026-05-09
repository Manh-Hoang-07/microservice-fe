type Id = string | number;

export const readingHistoryEndpoints = {
    user: {
        list: "/api/user/reading-history",
        update: "/api/user/reading-history",
        delete: (comicId: Id) => `/api/user/reading-history/${comicId}`,
    },
} as const;
