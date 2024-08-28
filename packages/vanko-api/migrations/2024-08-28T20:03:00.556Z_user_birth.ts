import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    db.schema
        .alterTable("user")
        .addColumn("birth", "date", (col) => col.notNull())
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    db.schema.alterTable("user").dropColumn("birth").execute();
}
