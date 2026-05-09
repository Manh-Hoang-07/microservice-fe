type Id = string | number;

export const testimonialEndpoints = {
    public: {
        list: "/api/testimonials",
        featured: "/api/testimonials/featured",
        getByProject: (projectId: Id) => `/api/testimonials/project/${projectId}`,
    },
    admin: {
        list: "/api/admin/testimonials",
        create: "/api/admin/testimonials",
        show: (id: Id) => `/api/admin/testimonials/${id}`,
        update: (id: Id) => `/api/admin/testimonials/${id}`,
        delete: (id: Id) => `/api/admin/testimonials/${id}`,
        toggleFeatured: (id: Id) => `/api/admin/testimonials/${id}/featured`,
    },
} as const;
