type Id = string | number;

export const comicEndpoints = {
    public: {
        list: "/api/public/comics",
        detail: (slug: string) => `/api/public/comics/${slug}`,
        chapters: (slug: string) => `/api/public/comics/${slug}/chapters`,
    },
    admin: {
        list: "/api/admin/comics",
        create: "/api/admin/comics",
        show: (id: Id) => `/api/admin/comics/${id}`,
        update: (id: Id) => `/api/admin/comics/${id}`,
        delete: (id: Id) => `/api/admin/comics/${id}`,
        uploadCover: (id: Id) => `/api/admin/comics/${id}/cover`,
    },
} as const;
