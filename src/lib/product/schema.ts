import { z } from "zod";

export type NewProductSchema = z.infer<typeof newProductSchema>;
export const newProductSchema = z.object({
    name: z.string().max(150).min(1),
    description: z.string(),
    number: z.coerce.number().int(),
    year: z.coerce.number().int(),
    bar_code: z.string().length(13),
    cost: z.string(),
    weight: z.number(),
    height: z.number(),
    width: z.number(),
    pricing_group: z.number(),
    category: z.number(),
    type: z.number(),
    images: z.instanceof(File).array().min(1)
});

export type ChangeProductStatus = z.infer<typeof changeProductStatusSchema>;
export const changeProductStatusSchema = z.object({
    id: z.number(),
    kind: z.enum(["deactivate", "activate"]),
    reason: z.string().max(200)
});

export type NewCategorySchema = z.infer<typeof newCategorySchema>;
export const newCategorySchema = z.object({
    name: z.string().length(50)
});

export type NewTypeSchema = z.infer<typeof newTypeSchema>;
export const newTypeSchema = z.object({
    name: z.string().length(50)
});

export type NewPricingGroup = z.infer<typeof newPricingGroupSchema>;
export const newPricingGroupSchema = z.object({
    name: z.string().length(50),
    profit_margin: z.number()
});
