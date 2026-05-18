import { z } from "zod";
import { statusField } from "@/config/validations/common";

const CODE_REGEX = /^[a-z][a-z0-9_.-]*$/i;

export const permissionSchema = z.object({
  code: z
    .string()
    .min(2, "Mã định danh tối thiểu 2 ký tự")
    .max(120, "Mã định danh không được vượt quá 120 ký tự")
    .regex(CODE_REGEX, "Code bắt đầu bằng chữ cái, chỉ chứa chữ-số-_-.-"),
  name: z.string().max(150, "Tên quyền không được vượt quá 150 ký tự").optional().nullable().or(z.literal("")),
  parentId: z
    .string()
    .regex(/^\d+$/, "parentId phải là số")
    .optional()
    .nullable()
    .or(z.literal("")),
  status: statusField,
});

export type PermissionFormValues = z.infer<typeof permissionSchema>;
