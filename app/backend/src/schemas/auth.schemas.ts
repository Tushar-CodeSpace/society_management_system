import { z } from "zod";

const email = z.string().email({ message: "valid email required" });
const password = z
    .string()
    .min(8, "password min 8")
    .regex(/[A-Za-z]/, "password must include letters")
    .regex(/\d/, "password must include numbers");

export const SignupCheckSchema = z.object({
    body: z.object({ email })
});

export const SignupCompleteSchema = z.object({
    body: z.object({ email, password })
});

export const LoginSchema = z.object({
    body: z.object({ email, password })
});
