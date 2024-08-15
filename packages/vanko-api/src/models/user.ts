import db from "@/db.ts";
import { SelectUser, InsertUser } from "@/models/types/user.ts";

export async function findById(id: number): Promise<SelectUser | undefined> {
    return await db
        .selectFrom("user")
        .where("id", "=", id)
        .selectAll()
        .executeTakeFirst();
}

export async function create(
    user: InsertUser
): Promise<SelectUser | undefined> {
    return await db
        .insertInto("user")
        .values(user)
        .returningAll()
        .executeTakeFirst();
}

export async function uniqueExists(
    field: "email" | "cpf",
    value: string
): Promise<boolean> {
    return (
        (await db
            .selectFrom("user")
            .where(field, "=", value)
            .executeTakeFirst()) != undefined
    );
}
