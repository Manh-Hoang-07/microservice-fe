export const systemConfigEndpoints = {
    public: {
        getByGroup: (group: string) => `/api/config/${group}`,
        general: "/api/config/general",
    },
    admin: {
        getByGroup: (group: string) => `/api/config/${group}`,
        update: (group: string) => `/api/config/config/${group}`,
        updateGeneral: "/api/config/config/general",
        updateEmail: "/api/config/config/email",
        enums: {
            all: "/api/enums",
            byName: (type: string) => `/api/enums/${type}`,
        },
    },
} as const;
