import { api } from "@/lib/api/client";
import { contactEndpoints } from "@/lib/api/endpoints";

export const contactAdminService = {
    reply: async (id: string | number, reply: string): Promise<void> => {
        await api.patch(contactEndpoints.admin.reply(id), { reply });
    },

    markAsRead: async (id: string | number): Promise<void> => {
        await api.patch(contactEndpoints.admin.markAsRead(id));
    },

    close: async (id: string | number): Promise<void> => {
        await api.patch(contactEndpoints.admin.close(id));
    },
};
