type Id = string | number;

export const galleryEndpoints = {
    public: {
        list: "/api/cms/public/galleries",
        featured: "/api/cms/public/galleries/featured",
        showBySlug: (slug: string) => `/api/cms/public/galleries/${slug}`,
    },
    admin: {
        list: "/api/cms/admin/galleries",
        create: "/api/cms/admin/galleries",
        show: (id: Id) => `/api/cms/admin/galleries/${id}`,
        update: (id: Id) => `/api/cms/admin/galleries/${id}`,
        delete: (id: Id) => `/api/cms/admin/galleries/${id}`,
    },
} as const;
