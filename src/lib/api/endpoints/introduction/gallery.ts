type Id = string | number;

export const galleryEndpoints = {
    public: {
        list: "/api/gallery",
        featured: "/api/gallery/featured",
        showBySlug: (slug: string) => `/api/gallery/${slug}`,
    },
    admin: {
        list: "/api/admin/gallery",
        create: "/api/admin/gallery",
        show: (id: Id) => `/api/admin/gallery/${id}`,
        update: (id: Id) => `/api/admin/gallery/${id}`,
        delete: (id: Id) => `/api/admin/gallery/${id}`,
    },
} as const;
