type Id = string | number;

export const comicCategoryEndpoints = {
    public: {
        list: "/api/public/comic-categories",
        show: (id: Id) => `/api/public/comic-categories/${id}`,
    },
    admin: {
        list: "/api/admin/comic-categories",
        create: "/api/admin/comic-categories",
        show: (id: Id) => `/api/admin/comic-categories/${id}`,
        update: (id: Id) => `/api/admin/comic-categories/${id}`,
        delete: (id: Id) => `/api/admin/comic-categories/${id}`,
    },
} as const;
