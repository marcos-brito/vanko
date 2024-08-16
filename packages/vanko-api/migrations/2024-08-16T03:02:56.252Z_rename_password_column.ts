import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    db.schema
        .alterTable("user")
        .renameColumn("hashed_password", "password")
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    db.schema
        .alterTable("user")
        .renameColumn("password", "hashed_password")
        .execute();
}
