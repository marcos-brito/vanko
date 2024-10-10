import { z } from "zod";
import { ResidenceType } from "./types";

export const addressSchema = z.object({
    name: z.string().min(1).max(50),
    country: z.string().max(56),
    city: z.string().max(40),
    state: z.string().length(2),
    zip_code: z.string().length(8),
    neighborhood: z.string().max(50),
    street: z.string().max(50),
    number: z.coerce.number().max(32767).min(-32767),
    residence_type: z.nativeEnum(ResidenceType),
    observations: z.string().max(400)
});

export type AddressSchema = z.infer<typeof addressSchema>;

export const updateAddressSchema = addressSchema.extend({ id: z.number() });
export type UpdateAddressSchema = z.infer<typeof updateAddressSchema>;

export const deleteAddressSchema = z.object({ id: z.number() });
export type DeleteAddressSchema = z.infer<typeof deleteAddressSchema>;
