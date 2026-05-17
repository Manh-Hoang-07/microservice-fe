import { z } from "zod";
import { statusEnumField } from "@/config/validations/common";

export const wardSchema = z.object({
  code: z
    .string()
    .min(1, "Mã phường/xã là bắt buộc")
    .max(20, "Mã không được vượt quá 20 ký tự"),
  name: z
    .string()
    .min(1, "Tên phường/xã là bắt buộc")
    .max(255, "Tên không được vượt quá 255 ký tự"),
  type: z
    .string()
    .min(1, "Loại phường/xã là bắt buộc")
    .max(50, "Loại tối đa 50 ký tự"),
  provinceId: z.string().min(1, "Tỉnh/Thành là bắt buộc"),
  status: statusEnumField,
});

export type WardFormValues = z.infer<typeof wardSchema>;
