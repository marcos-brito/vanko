import { categories, types, pricingGroups } from "$lib/schema/products";

export type Product = {
    number: number;
    type: string;
    description: string;
    name: string;
    status: "ativo" | "inativo" | null;
    category: string;
    id: number;
    year: number;
    bar_code: string;
    cost: string;
    weight: number;
    height: number;
    width: number;
    pricing_group: string;
};

export type PricingGroup = typeof pricingGroups.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Type = typeof types.$inferSelect;
