import type { Kysely } from "kysely";
import users from "./data/users.json";

export async function seed(db: Kysely<any>): Promise<void> {
    for (let user of users) {
        db.insertInto("user").values(user).execute();
    }
}
