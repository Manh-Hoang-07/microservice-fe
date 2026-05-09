type Id = string | number;

export const chapterEndpoints = {
    admin: {
        list: "/api/admin/chapters",
        create: "/api/admin/chapters",
        show: (id: Id) => `/api/admin/chapters/${id}`,
        update: (id: Id) => `/api/admin/chapters/${id}`,
        delete: (id: Id) => `/api/admin/chapters/${id}`,
        uploadPages: (id: Id) => `/api/admin/chapters/${id}/pages`,
        updatePages: (id: Id) => `/api/admin/chapters/${id}/pages`,
    },
} as const;
