import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    db.schema.alterTable("user").renameTo("users").execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    db.schema.alterTable("users").renameTo("user").execute();
}
