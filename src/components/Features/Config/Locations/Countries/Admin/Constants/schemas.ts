import { z } from "zod";
import { statusField, nameField } from "@/config/validations/common";

export const countrySchema = z.object({
  code: z
    .string()
    .min(1, "Mã quốc gia là bắt buộc")
    .max(10, "Mã quốc gia tối đa 10 ký tự"),
  codeAlpha3: z.string().max(10, "Mã alpha-3 tối đa 10 ký tự").optional().nullable().or(z.literal("")),
  name: nameField("Tên quốc gia"),
  officialName: z.string().max(255, "Tên đầy đủ tối đa 255 ký tự").optional().nullable().or(z.literal("")),
  phoneCode: z.string().max(20, "Mã điện thoại tối đa 20 ký tự").optional().nullable().or(z.literal("")),
  currencyCode: z.string().max(20, "Mã tiền tệ tối đa 20 ký tự").optional().nullable().or(z.literal("")),
  flagEmoji: z.string().max(20, "Emoji cờ tối đa 20 ký tự").optional().nullable().or(z.literal("")),
  status: statusField,
});

export type CountryFormValues = z.infer<typeof countrySchema>;
