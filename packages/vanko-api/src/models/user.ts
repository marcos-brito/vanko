import db from "@/db.ts";
import { SelectUser } from "@/models/types/user.ts";

export async function findById(id: number): Promise<SelectUser | undefined> {
    return await db
        .selectFrom("user")
        .where("id", "=", id)
        .selectAll()
        .executeTakeFirst();
}
