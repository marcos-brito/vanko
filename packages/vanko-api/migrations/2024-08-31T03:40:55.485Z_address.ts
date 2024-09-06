import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    db.schema
        .createTable("citys")
        .addColumn("id", "serial", (col) => col.primaryKey())
        .addColumn("name", "varchar(40)", (col) => col.notNull().unique())
        .execute();
    db.schema
        .createTable("states")
        .addColumn("id", "serial", (col) => col.primaryKey())
        .addColumn("name", "char(2)", (col) => col.notNull().unique())
        .execute();
    db.schema
        .createTable("countries")
        .addColumn("id", "serial", (col) => col.primaryKey())
        .addColumn("name", "varchar(56)", (col) => col.notNull().unique())
        .execute();

    db.schema
        .createTable("addresses")
        .addColumn("id", "serial", (col) => col.primaryKey())
        .addColumn("user", "serial", (col) =>
            col.references("users.id").notNull()
        )
        .addColumn("country", "serial", (col) =>
            col.references("countries.id").notNull()
        )
        .addColumn("state", "serial", (col) =>
            col.references("states.id").notNull()
        )
        .addColumn("city", "serial", (col) =>
            col.references("citys.id").notNull()
        )
        .addColumn("name", "varchar(50)", (col) => col.notNull())
        .addColumn("zip_code", "char(8)", (col) => col.notNull())
        .addColumn("neighborhood", "varchar(50)", (col) => col.notNull())
        .addColumn("street", "varchar(50)", (col) => col.notNull())
        .addColumn("number", "smallint", (col) => col.notNull())
        .addColumn("residence_type", "varchar(11)", (col) =>
            col.check(sql`residence_type IN ('casa', 'apartamento')`)
        )
        .addColumn("observations", "varchar(400)")
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    db.schema.dropTable("addresses").execute();
    db.schema.dropTable("countries").execute();
    db.schema.dropTable("states").execute();
    db.schema.dropTable("citys").execute();
}
