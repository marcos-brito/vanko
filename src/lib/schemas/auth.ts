import { z } from "zod";

export const signupSchema = z
    .object({
        name: z.string().max(150),
        email: z.string().email(),
        password: z.string().min(8),
        confirm_password: z.string().min(8)
    })
    .refine((data) => data.password == data.confirm_password, {
        message: "Senhas não correspondem",
        path: ["confirm_password"]
    });

export type SignupSchema = z.infer<typeof signupSchema>;

export const signinSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

export type SigninSchema = z.infer<typeof signinSchema>;
