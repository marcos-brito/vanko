import db from "@/db.ts";
import { User } from "@/models/types/user.ts";

export async function findById(id: number): Promise<User | undefined> {
    return await db
        .selectFrom("user")
        .where("id", "=", id)
        .selectAll()
        .executeTakeFirst();
}
