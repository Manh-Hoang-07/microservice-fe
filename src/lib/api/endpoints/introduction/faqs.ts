// src/lib/api/endpoints/introduction/faqs.ts
type Id = string | number;

export const faqEndpoints = {
    public: {
        list: "/api/cms/public/faqs",
        popular: "/api/cms/public/faqs/popular",
        show: (id: Id) => `/api/cms/public/faqs/${id}`,
        markHelpful: (id: Id) => `/api/cms/public/faqs/${id}/helpful`,
        view: (id: Id) => `/api/cms/public/faqs/${id}/view`,
    },
    admin: {
        list: "/api/cms/admin/faqs",
        create: "/api/cms/admin/faqs",
        show: (id: Id) => `/api/cms/admin/faqs/${id}`,
        update: (id: Id) => `/api/cms/admin/faqs/${id}`,
        delete: (id: Id) => `/api/cms/admin/faqs/${id}`,
    },
} as const;
