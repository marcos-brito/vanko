import { and, eq, inArray, count } from "drizzle-orm";
import { db, supabase } from "$lib/db";
import {
    categories,
    pricingGroups,
    products,
    Status,
    StatusChangeKind,
    statusChanges,
    types,
    type InsertCategory,
    type InsertPricingGroup,
    type InsertProduct,
    type InsertType,
    type SelectCategory,
    type SelectPricingGroup,
    type SelectProduct,
    type SelectType
} from "$lib/models";

export type QueryOptions = {
    page: number;
    pageSize: number;
    categories: Array<string>;
    types: Array<string>;
};

export async function findProduct(id: number) {
    const product = await db.query.products.findFirst({
        where: eq(products.id, id),
        columns: {
            pricing_group: false,
            category: false,
            type: false
        },
        with: {
            pricing_group: true,
            category: true,
            type: true
        }
    });

    if (!product) return undefined;

    return product;
}

export async function findAllProducts() {
    return await db.query.products.findMany({
        columns: {
            pricing_group: false,
            category: false,
            type: false
        },
        with: {
            pricing_group: true,
            category: true,
            type: true
        }
    });
}

export async function queryProducts(options: QueryOptions) {
    const categoriesFound = await db.query.categories.findMany({
        where: inArray(categories.name, options.categories)
    });
    const typesFound = await db.query.types.findMany({
        where: inArray(types.name, options.types)
    });

    return await db.query.products.findMany({
        columns: {
            pricing_group: false,
            category: false,
            type: false
        },
        with: {
            pricing_group: true,
            category: true,
            type: true
        },
        limit: options.page,
        offset: (options.page - 1) * options.pageSize,
        where: and(
            eq(products.status, Status.Active),
            categoriesFound.length > 0
                ? inArray(
                      products.category,
                      categoriesFound.map((c) => c.id)
                  )
                : undefined,
            typesFound.length > 0
                ? inArray(
                      products.type,
                      typesFound.map((t) => t.id)
                  )
                : undefined
        )
    });
}

export async function uploadProductImages(
    id: number,
    images: Array<File>
): Promise<void> {
    await Promise.all(
        images.map((image, idx) => {
            supabase.storage.from("products").upload(`${id}/${idx}`, image);
        })
    );
}

export async function findProductImages(id: number): Promise<Array<string>> {
    const files = await supabase.storage.from("products").list(id.toString());
    if (!files.data) return [];

    return files.data.map((file) => {
        const {
            data: { publicUrl }
        } = supabase.storage
            .from("products")
            .getPublicUrl(`${id}/${file.name}`);

        return publicUrl;
    });
}

export async function deactivateProduct(id: number, reason: string) {
    const [{ id: productId }] = await db
        .update(products)
        .set({ status: Status.Inactive })
        .where(eq(products.id, id))
        .returning({ id: products.id });

    if (!productId) return undefined;
    return await db.insert(statusChanges).values({
        product: productId,
        reason,
        kind: StatusChangeKind.Deactivation
    });
}

export async function activateProduct(id: number, reason: string) {
    const [{ id: productId }] = await db
        .update(products)
        .set({ status: Status.Active })
        .where(eq(products.id, id))
        .returning({ id: products.id });

    if (!productId) return undefined;
    return await db.insert(statusChanges).values({
        product: productId,
        reason,
        kind: StatusChangeKind.Deactivation
    });
}

export async function countProducts(): Promise<number> {
    const [result] = await db.select({ count: count() }).from(products);
    return result.count;
}

export async function insertProduct(
    product: InsertProduct
): Promise<SelectProduct | undefined> {
    return await db
        .insert(products)
        .values(product)
        .returning()
        .then((inserts) => inserts.at(0));
}

export async function insertPricingGroup(
    group: InsertPricingGroup
): Promise<SelectPricingGroup | undefined> {
    return await db
        .insert(pricingGroups)
        .values(group)
        .returning()
        .then((inserts) => inserts.at(0));
}

export async function findPricingGroups(): Promise<Array<SelectPricingGroup>> {
    return await db.query.pricingGroups.findMany();
}

export async function insertCategory(
    category: InsertCategory
): Promise<SelectCategory | undefined> {
    return await db
        .insert(categories)
        .values(category)
        .returning()
        .then((inserts) => inserts.at(0));
}

export async function findCategories(): Promise<Array<SelectCategory>> {
    return await db.query.categories.findMany();
}

export async function insertType(
    type: InsertType
): Promise<SelectType | undefined> {
    return await db
        .insert(types)
        .values(type)
        .returning()
        .then((inserts) => inserts.at(0));
}

export async function findTypes(): Promise<Array<SelectType>> {
    return await db.query.types.findMany();
}
