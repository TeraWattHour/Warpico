import { z } from "zod";

export const loginDto = z.object({
  email: z.string().email(),
  password: z
    .string()
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/),
});

export type LoginType = z.infer<typeof loginDto>;

export const registerDto = z.object({
  name: z.string().min(4).max(15),
  email: z.string().email(),
  password: z
    .string()
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/),
});
export type RegisterType = z.infer<typeof registerDto>;
