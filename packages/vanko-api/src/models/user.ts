import db from "@/db.ts";
import { SelectUser, InsertUser, UpdateUser } from "@/models/types/user.ts";
import { Expression, SqlBool } from "kysely";

export async function findById(id: number): Promise<SelectUser | undefined> {
    return await db
        .selectFrom("users")
        .where("id", "=", id)
        .selectAll()
        .executeTakeFirst();
}

export async function create(
    user: InsertUser
): Promise<SelectUser | undefined> {
    return await db
        .insertInto("users")
        .values(user)
        .returningAll()
        .executeTakeFirst();
}

export async function update(id: number, user: UpdateUser) {
    return await db
        .updateTable("users")
        .set(user)
        .where("id", "=", id)
        .execute();
}

export async function del(id: number) {
    return await db
        .deleteFrom("users")
        .where("id", "=", id)
        .returningAll()
        .executeTakeFirst();
}

export async function canUpdate(id: number, req: UpdateUser): Promise<boolean> {
    let query = db.selectFrom("users").where("id", "!=", id);

    if (req.email || req.cpf) {
        query = query.where((eb) => {
            const ors: Expression<SqlBool>[] = [];

            if (req.email) {
                ors.push(eb("email", "=", req.email));
            }

            if (req.cpf) {
                ors.push(eb("cpf", "=", req.cpf));
            }

            return eb.or(ors);
        });
    }

    return (await query.executeTakeFirst()) === undefined;
}

export async function canCreate(req: InsertUser): Promise<boolean> {
    return (
        (await db
            .selectFrom("users")
            .where((eb) => eb("email", "=", req.email).or("cpf", "=", req.cpf))
            .executeTakeFirst()) === undefined
    );
}
