import { z } from "zod";
import { statusField } from "@/config/validations/common";

const CODE_REGEX = /^[a-z][a-z0-9_.-]*$/i;

export const roleSchema = z.object({
  code: z
    .string()
    .min(2, "Mã code tối thiểu 2 ký tự")
    .max(100, "Mã code không được vượt quá 100 ký tự")
    .regex(CODE_REGEX, "Code bắt đầu bằng chữ cái, chỉ chứa chữ-số-_-.-"),
  name: z.string().max(150, "Tên vai trò không được vượt quá 150 ký tự").optional().nullable().or(z.literal("")),
  parentId: z
    .string()
    .regex(/^\d+$/, "parentId phải là số")
    .optional()
    .nullable()
    .or(z.literal("")),
  status: statusField,
});

export type RoleFormValues = z.infer<typeof roleSchema>;
