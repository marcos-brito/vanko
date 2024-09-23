import { z } from "zod";

export const newProductSchema = z.object({
    name: z.string().max(150).min(1),
    description: z.string(),
    number: z.coerce.number().int(),
    year: z.coerce.number().int(),
    bar_code: z.string().length(13),
    cost: z.number().max(99999.99).min(0.1),
    weight: z.number(),
    height: z.number(),
    width: z.number(),
    pricing_group: z.string(),
    category: z.string(),
    type: z.string(),
    images: z.instanceof(File).array().min(1)
});

export type NewProductSchema = z.infer<typeof newProductSchema>;

export const newCategorySchema = z.object({
    name: z.string().length(50)
});

export type NewCategorySchema = z.infer<typeof newCategorySchema>;

export const newTypeSchema = z.object({
    name: z.string().length(50)
});

export type NewTypeSchema = z.infer<typeof newTypeSchema>;

export const newPricingGroup = z.object({
    name: z.string().length(50),
    profit_margin: z.number()
});

export type NewPricingGroup = z.infer<typeof newPricingGroup>;
