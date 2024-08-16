import { Gender } from "@/models/types/user.ts";
import { z } from "zod";

export const IdParameterSchema = z.object({
    id: z.coerce.number()
});

export type IdParameter = z.infer<typeof IdParameterSchema>;

export const UserCreateSchema = z.object({
    name: z.string().max(150),
    email: z.string().email(),
    cpf: z.string().length(11),
    password: z.string().min(8),
    gender: z.nativeEnum(Gender).default(Gender.Unspecified),
    phone: z.string().length(11)
});

export type UserCreateReq = z.infer<typeof UserCreateSchema>;
