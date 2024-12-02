import type { NewProductSchema } from "./types";
import { and, eq, inArray, count } from "drizzle-orm";
import { db } from "$lib/db";
import {
    categories,
    pricingGroups,
    products,
    statusChanges,
    types
} from "$lib/schema";
import { type Category, type PricingGroup, type Type } from "./types";
import type { Product } from "$lib/shared/types";
export async function findAllProducts(): Promise<Array<Product>> {
    const found = await db.query.products.findMany({
        with: {
            pricing_group: true,
            category: true,
            type: true
        }
    });

    return found.map((product) => {
        return {
            ...product,
            profit_margin: product.pricing_group.profit_margin,
            category: product.category.name,
            type: product.type.name
        };
    });
}
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

export async function deactivateProduct(id: number, reason: string) {
    const [{ id: productId }] = await db
        .update(products)
        .set({ status: "inativo" })
        .where(eq(products.id, id))
        .returning({ id: products.id });

    if (!productId) return undefined;
    return await db.insert(statusChanges).values({
        product: productId,
        reason,
        kind: "deactivate"
    });
}

export async function activateProduct(id: number, reason: string) {
    const [{ id: productId }] = await db
        .update(products)
        .set({ status: "ativo" })
        .where(eq(products.id, id))
        .returning({ id: products.id });

    if (!productId) return undefined;
    return await db.insert(statusChanges).values({
        product: productId,
        reason,
        kind: "activate"
    });
}

export async function countProducts(): Promise<number> {
    const [result] = await db.select({ count: count() }).from(products);
    return result.count;
}

export async function insertProduct(product: NewProductSchema) {
    const results = await Promise.all([
        db.query.types.findFirst({
            where: eq(types.name, product.type)
        }),
        db.query.categories.findFirst({
            where: eq(categories.name, product.category)
        }),
        db.query.pricingGroups.findFirst({
            where: eq(pricingGroups.name, product.pricing_group)
        })
    ]);
    if (results.some((result) => !result)) return undefined;

    const [type, category, pricingGroup] = results;
    const { images, ...rest } = product;
    const [inserted] = await db
        .insert(products)
        .values({
            ...rest,
            type: type!.id,
            cost: product.cost.toString(),
            category: category!.id,
            pricing_group: pricingGroup!.id
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
