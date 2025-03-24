import { z } from "zod";
import { ResidenceKind } from "$lib/models";

export const createAddressSchema = z.object({
    name: z.string().min(1).max(50),
    city: z.string().max(40),
    state: z.string().length(2),
    zip_code: z.string().length(8),
    neighborhood: z.string().max(50),
    street: z.string().max(50),
    number: z.coerce.number().max(32767).min(-32767),
    residence_type: z.nativeEnum(ResidenceKind),
    observations: z.string().max(400)
});

export type CreateAddressSchema = z.infer<typeof createAddressSchema>;

export const updateAddressSchema = createAddressSchema
    .partial()
    .extend({ id: z.number() });
export type UpdateAddressSchema = z.infer<typeof updateAddressSchema>;

export const deleteAddressSchema = z.object({ id: z.number() });
export type DeleteAddressSchema = z.infer<typeof deleteAddressSchema>;
