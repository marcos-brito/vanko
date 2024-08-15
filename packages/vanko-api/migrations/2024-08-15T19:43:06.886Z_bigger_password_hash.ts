import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    db.schema
        .alterTable("user")
        .alterColumn("hashed_password", (ac) => ac.setDataType("char(128)"))
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    db.schema
        .alterTable("user")
        .alterColumn("hashed_password", (ac) => ac.setDataType("char(60)"))
        .execute();
}
