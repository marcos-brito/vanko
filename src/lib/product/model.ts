import type { NewProductSchema } from "./schema";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "$lib/db";
import { categories, pricingGroups, products, types } from "$lib/schema";
import { type Category, type PricingGroup, type Type } from "./types";
import type { Product } from "$lib/shared/types";
export async function findProduct(id: number): Promise<Product | undefined> {
    const product = await db.query.products.findFirst({
        where: eq(products.id, id),
        with: {
            pricing_group: true,
            category: true,
            type: true
        }
    });
    if (!product) return undefined;

    return {
        ...product,
        profit_margin: product.pricing_group.profit_margin,
        category: product.category.name,
        type: product.type.name
    };
}

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
