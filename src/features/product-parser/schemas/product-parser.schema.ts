import { z } from "zod";

export const parseProductSchema = z.object({
  url: z.string().trim().url("Paste a valid shopping URL.")
});

export type ParseProductValues = z.infer<typeof parseProductSchema>;
