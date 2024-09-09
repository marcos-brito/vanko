import { z } from "zod";

export enum Gender {
    FEMALE = "feminino",
    MALE = "masculino",
    OTHER = "outro"
}

export const updatePersonalInfoSchema = z.object({
    name: z.string().max(150).min(1),
    email: z.string().email(),
    cpf: z.string().regex(/\d{11,}/),
    phone: z.string().regex(/\d{11,}/),
    gender: z.nativeEnum(Gender),
    birth: z.date().min(new Date("1900-01-01")).max(new Date())
});

export type UpdatePersonalInfoSchema = z.infer<typeof updatePersonalInfoSchema>;

export const changePasswordSchema = z
    .object({
        old: z.string().min(8),
        new: z.string().min(8),
        confirm: z.string().min(8)
    })
    .refine((data) => data.new == data.confirm, {
        message: "Senhas não correspondem",
        path: ["confirm"]
    });

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
