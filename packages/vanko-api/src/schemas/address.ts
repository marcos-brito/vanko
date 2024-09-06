import { ResidenceType } from "@/models/types/address.ts";
import { z } from "zod";

export const addressCreateSchema = z.object({
    name: z.string().min(1).max(50),
    country: z.string().max(56),
    city: z.string().max(40),
    state: z.string().length(2),
    zip_code: z.string().length(8),
    neighborhood: z.string().max(50),
    street: z.string().max(50),
    number: z.number().max(32767).min(-32767),
    residence_type: z.nativeEnum(ResidenceType),
    observations: z.string().max(400)
});

export type AddressCreateReq = z.infer<typeof addressCreateSchema>;

export const addressPatchSchema = addressCreateSchema.partial();

export type AddressPatchReq = z.infer<typeof addressPatchSchema>;
