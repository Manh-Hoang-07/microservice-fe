type Id = string | number;

export const testimonialEndpoints = {
    public: {
        list: "/api/cms/public/testimonials",
        featured: "/api/cms/public/testimonials/featured",
        getByProject: (projectId: Id) => `/api/cms/public/testimonials/project/${projectId}`,
    },
    admin: {
        list: "/api/cms/admin/testimonials",
        create: "/api/cms/admin/testimonials",
        show: (id: Id) => `/api/cms/admin/testimonials/${id}`,
        update: (id: Id) => `/api/cms/admin/testimonials/${id}`,
        delete: (id: Id) => `/api/cms/admin/testimonials/${id}`,
        toggleFeatured: (id: Id) => `/api/cms/admin/testimonials/${id}/featured`,
    },
} as const;
