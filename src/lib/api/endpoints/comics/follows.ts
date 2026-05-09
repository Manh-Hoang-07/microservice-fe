type Id = string | number;

export const followEndpoints = {
    user: {
        list: "/api/user/follows",
        follow: (comicId: Id) => `/api/user/follows/comics/${comicId}`,
        unfollow: (comicId: Id) => `/api/user/follows/comics/${comicId}`,
        checkStatus: (comicId: Id) => `/api/user/follows/comics/${comicId}/is-following`,
    },
} as const;
