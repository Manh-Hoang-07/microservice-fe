type Id = string | number;

export const staffEndpoints = {
    public: {
        list: "/api/cms/public/staff",
        show: (id: Id) => `/api/cms/public/staff/${id}`,
        getByDepartment: (department: string) => `/api/cms/public/staff/department/${department}`,
    },
    admin: {
        list: "/api/cms/admin/staff",
        create: "/api/cms/admin/staff",
        show: (id: Id) => `/api/cms/admin/staff/${id}`,
        update: (id: Id) => `/api/cms/admin/staff/${id}`,
        delete: (id: Id) => `/api/cms/admin/staff/${id}`,
    },
} as const;
