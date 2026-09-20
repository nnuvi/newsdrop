import { z } from "zod";

export const SummaryResponseSchema = z.object({
  id: z.string(),
  article_ids: z.array(z.string()),
  summary: z.string(),
  model: z.string(),
  created_at: z.string().datetime(),
});

export type SummaryResponse = z.infer<typeof SummaryResponseSchema>;
