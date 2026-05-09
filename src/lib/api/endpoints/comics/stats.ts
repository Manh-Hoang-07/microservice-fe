export const comicStatsEndpoints = {
    admin: {
        overview: "/api/admin/comic-stats/overview",
        topViewed: "/api/admin/comic-stats/top-viewed",
        topFollowed: "/api/admin/comic-stats/top-followed",
        trending: "/api/admin/comic-stats/trending",
    },
} as const;
