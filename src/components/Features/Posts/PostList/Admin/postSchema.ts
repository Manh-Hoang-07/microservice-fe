import { z } from "zod";
import {
  nameField,
  optionalImage,
  optionalUrl,
  optionalText,
  numberArrayField,
  booleanField,
} from "@/config/validations/common";

export const postSchema = z.object({
  name: nameField("Tiêu đề"),
  excerpt: optionalText(2000, "Tóm tắt"),
  content: z.string().optional().nullable(),
  coverImage: optionalImage,
  image: optionalImage,
  postType: z.string().default("text"),
  videoUrl: optionalUrl,
  audioUrl: optionalUrl,
  status: z.string().min(1, "Trạng thái là bắt buộc").default("draft"),
  publishedAt: z.string().optional().nullable().or(z.literal("")),
  categoryIds: numberArrayField,
  tagIds: numberArrayField,
  isFeatured: booleanField(),
  isPinned: booleanField(),
  seoTitle: optionalText(255, "SEO Title"),
  seoDescription: optionalText(2000, "SEO Description"),
  seoKeywords: optionalText(500, "SEO Keywords"),
});

export type PostFormValues = z.infer<typeof postSchema>;
