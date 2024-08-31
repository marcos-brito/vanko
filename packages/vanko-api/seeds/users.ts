import type { Kysely } from "kysely";
import { generateMultipleUsers } from "@/utils.ts";

export async function seed(db: Kysely<any>): Promise<void> {
    const users = generateMultipleUsers(1);

    for (const user of users) {
        await db.insertInto("users").values(user).execute();
    }
}
