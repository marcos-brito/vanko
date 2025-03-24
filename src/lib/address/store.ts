import { db } from "$lib/db";
import { eq } from "drizzle-orm";
import { addresses } from "$lib/models";
import type { InsertAdress, SelectAddress } from "$lib/models";

export async function insertAddress(
    address: InsertAdress
): Promise<SelectAddress | undefined> {
    return await db
        .insert(addresses)
        .values(address)
        .returning()
        .then((inserts) => inserts.at(0));
}

export async function updateAddress(
    id: number,
    address: Partial<InsertAdress>
): Promise<SelectAddress | undefined> {
    return await db
        .update(addresses)
        .set(address)
        .where(eq(addresses.id, id))
        .returning()
        .then((updates) => updates.at(0));
}

export async function userOwnsAddress(
    addressId: number,
    userId: string
): Promise<boolean> {
    return await db.query.addresses
        .findFirst({
            columns: { user: true },
            where: eq(addresses.id, addressId)
        })
        .then((address) => address?.user == userId);
}

export async function deleteAddress(
    id: number
): Promise<SelectAddress | undefined> {
    return await db
        .delete(addresses)
        .where(eq(addresses.id, id))
        .returning()
        .then((deletions) => deletions.at(0));
}

export async function findUserAddresses(
    userId: string
): Promise<Array<SelectAddress>> {
    return await db.query.addresses.findMany({
        where: eq(addresses.user, userId)
    });
}
