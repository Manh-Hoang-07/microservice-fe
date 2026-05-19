import { z } from "zod";
import { nameField, statusField, optionalText } from "@/config/validations/common";

export const tagSchema = z.object({
  name: nameField("Tên thẻ"),
  description: optionalText(500),
  status: statusField,
});
export type TagFormValues = z.infer<typeof tagSchema>;
