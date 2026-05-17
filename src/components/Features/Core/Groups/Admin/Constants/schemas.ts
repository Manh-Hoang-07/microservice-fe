import { z } from "zod";
import { codeField, nameField, optionalText, statusEnumField } from "@/config/validations/common";

const TYPE_REGEX = /^[a-z][a-z0-9_-]*$/;
const CODE_REGEX = /^[a-z][a-z0-9_.-]*$/i;

export const groupSchema = z.object({
  type: z
    .string()
    .min(2, "Loại group tối thiểu 2 ký tự")
    .max(50, "Loại tối đa 50 ký tự")
    .regex(TYPE_REGEX, "Loại bắt đầu bằng chữ cái, chỉ chứa a-z, 0-9, _ hoặc -"),
  code: codeField("Mã code").refine((v) => CODE_REGEX.test(v), {
    message: "Code bắt đầu bằng chữ cái, chỉ chứa chữ-số-_-.-",
  }),
  name: nameField("Tên group"),
  description: optionalText(1000),
  ownerId: z
    .string()
    .regex(/^\d+$/, "ownerId phải là số")
    .optional()
    .nullable()
    .or(z.literal("")),
  status: statusEnumField,
});

export type GroupFormValues = z.infer<typeof groupSchema>;
