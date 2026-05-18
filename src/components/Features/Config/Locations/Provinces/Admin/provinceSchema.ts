import { z } from "zod";
import { statusEnumField, optionalText } from "@/config/validations/common";

export const provinceSchema = z.object({
  code: z
    .string()
    .min(1, "Mã tỉnh/thành là bắt buộc")
    .max(20, "Mã không được vượt quá 20 ký tự"),
  name: z
    .string()
    .min(1, "Tên tỉnh/thành là bắt buộc")
    .max(255, "Tên không được vượt quá 255 ký tự"),
  type: z
    .string()
    .min(1, "Loại tỉnh/thành là bắt buộc")
    .max(50, "Loại tối đa 50 ký tự"),
  phoneCode: z.string().max(20, "Mã điện thoại tối đa 20 ký tự").optional().nullable().or(z.literal("")),
  countryId: z.string().min(1, "Quốc gia là bắt buộc"),
  status: statusEnumField,
  note: optionalText(2000),
  codeBnv: z.string().max(20, "codeBnv tối đa 20 ký tự").optional().nullable().or(z.literal("")),
  codeTms: z.string().max(20, "codeTms tối đa 20 ký tự").optional().nullable().or(z.literal("")),
});

export type ProvinceFormValues = z.infer<typeof provinceSchema>;
