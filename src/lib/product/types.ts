import { categories, types, pricingGroups } from "$lib/schema/products";

export type PricingGroup = typeof pricingGroups.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Type = typeof types.$inferSelect;
