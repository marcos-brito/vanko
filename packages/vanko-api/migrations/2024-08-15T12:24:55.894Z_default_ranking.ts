import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    db.schema
        .alterTable("user")
        .alterColumn("ranking", (ac) => ac.setDefault("1"))
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    db.schema
        .alterTable("user")
        .alterColumn("ranking", (ac) => ac.dropDefault())
        .execute();
}
