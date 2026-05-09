type Id = string | number;

export const bookmarkEndpoints = {
    user: {
        list: "/api/user/bookmarks",
        create: "/api/user/bookmarks",
        delete: (id: Id) => `/api/user/bookmarks/${id}`,
    },
} as const;
