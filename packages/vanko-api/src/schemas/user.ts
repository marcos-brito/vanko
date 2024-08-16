import { Gender, Role, Status } from "@/models/types/user.ts";
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

export const UserUpdateSchema = z.object({
    id: z.number(),
    name: z.string().max(150),
    email: z.string().email(),
    role: z.nativeEnum(Role),
    cpf: z.string().length(11),
    password: z.string().min(8),
    gender: z.nativeEnum(Gender).default(Gender.Unspecified),
    phone: z.string().length(11),
    ranking: z.number(),
    status: z.nativeEnum(Status)
});

export type UserUpdateReq = z.infer<typeof UserUpdateSchema>;

export const UserPatchSchema = UserUpdateSchema.partial();
export type UserPatchReq = z.infer<typeof UserPatchSchema>;
