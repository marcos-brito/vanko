import { categories, types, pricingGroups } from "$lib/schema/products";
import type { z } from "zod";
import type {
    newCategorySchema,
    newPricingGroup,
    newProductSchema,
    newTypeSchema
} from "./schema";

export type PricingGroup = typeof pricingGroups.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Type = typeof types.$inferSelect;

export type NewProductSchema = z.infer<typeof newProductSchema>;
export type NewPricingGroup = z.infer<typeof newPricingGroup>;
export type NewTypeSchema = z.infer<typeof newTypeSchema>;
export type NewCategorySchema = z.infer<typeof newCategorySchema>;
