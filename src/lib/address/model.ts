import { db } from "$lib/db";
import { eq } from "drizzle-orm";
import type { Address, State, Country } from "./types";
import { addresses, countries, states } from "$lib/schema";
import type {
    AddressSchema,
    DeleteAddressSchema,
    UpdateAddressSchema
} from "./schema";
import type { ResidenceType } from "$lib/_schemas";

export async function insertAddress(userId: string, address: AddressSchema) {
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

export async function updateAddress(address: UpdateAddressSchema) {
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

export async function userOwnsAddress(addressId: number, userId: string) {
    const addressOwner = await db.query.addresses.findFirst({
        columns: { user: true },
        where: eq(addresses.id, addressId)
    });

    if (!addressOwner) return false;

    return addressOwner.user == userId;
}

export async function deleteAddress(address: DeleteAddressSchema) {
    const [deleted] = await db
        .delete(addresses)
        .where(eq(addresses.id, address.id))
        .returning();

    return deleted;
}

export async function findUserAddresses(
    userId: string
): Promise<Array<Address>> {
    const found = await db.query.addresses.findMany({
        columns: {
            user: false,
            country: false,
            state: false
        },
        with: {
            country: true,
            state: true
        },
        where: eq(addresses.user, userId)
    });

    return found.map((address) => {
        return {
            ...address,
            state: address.state.name,
            country: address.country.name,
            residence_type: address.residence_type as ResidenceType
        };
    });
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
