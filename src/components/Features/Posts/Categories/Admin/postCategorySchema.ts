import { z } from "zod";
import { statusField, sortOrderField, optionalText, optionalNumber } from "@/config/validations/common";

export const postCategorySchema = z.object({
  name: z.string().min(1, "Tên danh mục là bắt buộc").max(255, "Tên danh mục không được vượt quá 255 ký tự"),
  description: z.string().optional().nullable(),
  status: statusField,
  sortOrder: sortOrderField,
  parentId: optionalNumber,
  seoTitle: optionalText(255, "SEO Title"),
  seoDescription: optionalText(2000, "SEO Description"),
  seoKeywords: optionalText(500, "SEO Keywords"),
});

export type PostCategoryFormValues = z.infer<typeof postCategorySchema>;
