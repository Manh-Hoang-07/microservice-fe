type Id = string | number;

export const staffEndpoints = {
    public: {
        list: "/api/staff",
        show: (id: Id) => `/api/staff/${id}`,
        getByDepartment: (department: string) => `/api/staff/department/${department}`,
    },
    admin: {
        list: "/api/admin/staff",
        create: "/api/admin/staff",
        show: (id: Id) => `/api/admin/staff/${id}`,
        update: (id: Id) => `/api/admin/staff/${id}`,
        delete: (id: Id) => `/api/admin/staff/${id}`,
    },
} as const;
