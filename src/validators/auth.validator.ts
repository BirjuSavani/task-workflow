import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email().toLowerCase(),
  password: z.string().min(6).regex(/[A-Z]/).regex(/[0-9]/),
});

export const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
