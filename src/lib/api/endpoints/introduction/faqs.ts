type Id = string | number;

export const faqEndpoints = {
    public: {
        list: "/api/faqs",
        popular: "/api/faqs/popular",
        show: (id: Id) => `/api/faqs/${id}`,
        markHelpful: (id: Id) => `/api/faqs/${id}/helpful`,
    },
    admin: {
        list: "/api/admin/faqs",
        create: "/api/admin/faqs",
        show: (id: Id) => `/api/admin/faqs/${id}`,
        update: (id: Id) => `/api/admin/faqs/${id}`,
        delete: (id: Id) => `/api/admin/faqs/${id}`,
    },
} as const;
