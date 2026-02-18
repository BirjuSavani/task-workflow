import { z } from "zod";

export const generateReportSchema = z.object({
  sendEmail: z.boolean().default(false),
});

export type GenerateReportInput = z.infer<typeof generateReportSchema>;
