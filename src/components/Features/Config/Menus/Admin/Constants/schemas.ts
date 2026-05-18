import { z } from "zod";
import { statusField, sortOrderField, booleanField } from "@/config/validations/common";

export const menuSchema = z.object({
  code: z.string().min(3, "Code phải có ít nhất 3 ký tự").max(120, "Code tối đa 120 ký tự"),
  name: z.string().min(1, "Tên menu là bắt buộc").max(150, "Tên menu tối đa 150 ký tự"),
  path: z.string().max(255, "Path tối đa 255 ký tự").optional().nullable(),
  apiPath: z.string().max(255, "API Path tối đa 255 ký tự").optional().nullable(),
  icon: z.string().max(120, "Icon tối đa 120 ký tự").optional().nullable(),
  type: z.string().min(1, "Loại menu là bắt buộc").default("route"),
  status: statusField,
  parentId: z.string().optional().nullable(),
  sortOrder: sortOrderField,
  isPublic: booleanField(),
  showInMenu: booleanField(true),
  requiredPermissionCode: z.string().optional().nullable(),
  group: z.string().min(1, "Group là bắt buộc").default("admin"),
});

export type MenuFormValues = z.infer<typeof menuSchema>;
