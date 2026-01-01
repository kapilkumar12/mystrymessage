// schemas/acceptMessagesSchema.ts
import { z } from "zod";

export const acceptMessagesSchema = z.object({
  acceptMessages: z.boolean(),
});

export type AcceptMessagesSchema = z.infer<typeof acceptMessagesSchema>;