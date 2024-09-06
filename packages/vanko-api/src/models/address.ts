import db from "@/db.ts";
import {
    InsertAddress,
    SelectAddress,
    SelectState,
    SelectCity,
    SelectCountry,
    InsertCity,
    InsertCountry,
    InsertState,
    UpdateAddress
} from "./types/address.ts";

export async function belongingTo(
    user_id: number
): Promise<Array<SelectAddress>> {
    return await db
        .selectFrom("addresses")
        .selectAll()
        .where("user", "=", user_id)
        .innerJoin("countries", "countries.id", "country")
        .innerJoin("citys", "citys.id", "city")
        .innerJoin("states", "states.id", "state")
        .select([
            "citys.name as city",
            "states.name as state",
            "countries.name as country"
        ])
        .execute();
}

export async function findById(id: number): Promise<SelectAddress | undefined> {
    return await db
        .selectFrom("addresses")
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirst();
}

export async function create(
    address: InsertAddress
): Promise<SelectAddress | undefined> {
    return await db
        .insertInto("addresses")
        .values(address)
        .returningAll()
        .executeTakeFirst();
}

export async function del(id: number): Promise<SelectAddress | undefined> {
    return await db
        .deleteFrom("addresses")
        .where("id", "=", id)
        .returningAll()
        .executeTakeFirst();
}

export async function update(
    id: number,
    address: UpdateAddress
): Promise<SelectAddress | undefined> {
    return await db
        .updateTable("addresses")
        .set(address)
        .where("id", "=", id)
        .returningAll()
        .executeTakeFirst();
}

export async function insertCountry(
    country: InsertCountry
): Promise<SelectCountry | undefined> {
    return await db
        .insertInto("countries")
        .values(country)
        .onConflict((c) => c.column("name").doUpdateSet({ name: country.name }))
        .returningAll()
        .executeTakeFirst();
}
export async function insertState(
    state: InsertState
): Promise<SelectState | undefined> {
    return await db
        .insertInto("states")
        .values(state)
        .onConflict((c) => c.column("name").doUpdateSet({ name: state.name }))
        .returningAll()
        .executeTakeFirst();
}

export async function insertCity(
    city: InsertCity
): Promise<SelectCity | undefined> {
    return await db
        .insertInto("citys")
        .values(city)
        .onConflict((c) => c.column("name").doUpdateSet({ name: city.name }))
        .returningAll()
        .executeTakeFirst();
}
