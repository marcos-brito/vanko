import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    db.schema
        .createTable("user")
        .addColumn("id", "serial", (col) => col.primaryKey())
        .addColumn("name", "varchar(150)", (col) => col.notNull())
        .addColumn("cpf", "char(11)", (col) => col.notNull())
        .addColumn("phone", "char(11)", (col) => col.notNull())
        .addColumn("ranking", "smallint", (col) => col.notNull())
        .addColumn("email", "varchar(254)", (col) => col.notNull().unique())
        .addColumn("hashed_password", "char(60)", (col) => col.notNull())
        .addColumn("gender", "varchar(11)", (col) =>
            col
                .check(sql`gender IN ('male', 'female', 'unspecified')`)
                .defaultTo("unspecified")
        )
        .addColumn("role", "varchar(5)", (col) =>
            col.check(sql`role IN ('user', 'admin')`).defaultTo("user")
        )
        .addColumn("status", "varchar(8)", (col) =>
            col.check(sql`status IN ('active', 'inactive')`).defaultTo("active")
        )
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    db.schema.dropTable("user").execute();
}
