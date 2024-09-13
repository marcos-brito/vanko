import { states, type Address, type Country, type State } from "./schema";
import { db } from ".";
import {
    type AddressSchema,
    type DeleteAddressSchema,
    type UpdateAddressSchema
} from "$lib/schemas";
import { addresses, countries } from "./schema";
import { eq } from "drizzle-orm";

export async function insertAddress(
    userId: string,
    address: AddressSchema
): Promise<Address | undefined> {
    const country = await findOrCreateCountry(address.country);
    if (!country) return undefined;

    const state = await findOrCreateState(address.state);
    if (!state) return undefined;

    const newAddress = {
        ...address,
        user: userId,
        state: state.id,
        country: country.id
    };

    const [inserted] = await db
        .insert(addresses)
        .values(newAddress)
        .returning();

    return inserted;
}

export async function updateAddress(
    address: UpdateAddressSchema
): Promise<Address | undefined> {
    const country = await findOrCreateCountry(address.country);
    if (!country) return undefined;

    const state = await findOrCreateState(address.state);
    if (!state) return undefined;

    const changes = {
        ...address,
        state: state.id,
        country: country.id
    };

    const [updated] = await db
        .update(addresses)
        .set(changes)
        .where(eq(addresses.id, address.id))
        .returning();

    return updated;
}

export async function userOwnsAddress(
    addressId: number,
    userId: string
): Promise<boolean> {
    const addressOwner = await db.query.addresses.findFirst({
        columns: { user: true },
        where: eq(addresses.id, addressId)
    });

    if (!addressOwner) return false;

    return addressOwner.user == userId;
}

export async function deleteAddress(
    address: DeleteAddressSchema
): Promise<Address | undefined> {
    const [deleted] = await db
        .delete(addresses)
        .where(eq(addresses.id, address.id))
        .returning();

    return deleted;
}

async function findOrCreateState(state: string): Promise<State | undefined> {
    const exist = await db.query.states.findFirst({
        where: eq(states.name, state)
    });
    if (exist) return exist;

    const [inserted] = await db
        .insert(states)
        .values({ name: state })
        .returning();

    return inserted;
}

async function findOrCreateCountry(
    country: string
): Promise<Country | undefined> {
    const exist = await db.query.countries.findFirst({
        where: eq(countries.name, country)
    });
    if (exist) return exist;

    const [inserted] = await db
        .insert(countries)
        .values({ name: country })
        .returning();

    return inserted;
}
