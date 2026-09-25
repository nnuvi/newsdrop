import { z } from "zod";

export const SummaryResponseSchema = z.object({
  id: z.string(),
  topic_ids: z.array(z.string()),
  article_ids: z.array(z.string()),
  summary: z.string(),
  model: z.string(),
  created_at: z.string(),
  // created_at: z.iso.datetime({ offset: true }),
});

export type SummaryResponse = z.infer<typeof SummaryResponseSchema>;
