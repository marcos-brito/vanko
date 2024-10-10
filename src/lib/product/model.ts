import type { NewProductSchema } from "$lib/schemas";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "$lib/database";
import { categories, pricingGroups, products, types } from "$lib/schema";
import { type Category, type PricingGroup, type Type } from "./types";
export async function insertProduct(product: NewProductSchema) {
    const type = await db.query.types.findFirst({
        where: eq(types.name, product.type)
    });
    if (!type) return undefined;

    const category = await db.query.categories.findFirst({
        where: eq(categories.name, product.category)
    });
    if (!category) return undefined;

    const pricingGroup = await db.query.pricingGroups.findFirst({
        where: eq(pricingGroups.name, product.pricing_group)
    });
    if (!pricingGroup) return undefined;

    const { images, ...rest } = product;
    const [inserted] = await db
        .insert(products)
        .values({
            ...rest,
            type: type.id,
            cost: product.cost.toString(),
            category: category.id,
            pricing_group: pricingGroup.id
        })
        .returning();

    return inserted;
}

export async function findPricingGroups(): Promise<Array<PricingGroup>> {
    return await db.query.pricingGroups.findMany();
}

export async function findCategories(): Promise<Array<Category>> {
    return await db.query.categories.findMany();
}

export async function findTypes(): Promise<Array<Type>> {
    return await db.query.types.findMany();
}
