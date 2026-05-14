export const systemConfigEndpoints = {
    public: {
        getByGroup: (group: string) => `/api/config/${group}`,
        general: "/api/config/general",
    },
    admin: {
        general: "/api/config/admin/general",
        getByGroup: (group: string) => `/api/config/admin/${group}`,
        update: (group: string) => `/api/config/admin/${group}`,
        updateGeneral: "/api/config/admin/general",
        updateEmail: "/api/config/admin/email",
        enums: {
            all: "/api/enums",
            byName: (type: string) => `/api/enums/${type}`,
        },
    },
    cache: {
        flush: "/api/config/cache/flush",
    },
} as const;
