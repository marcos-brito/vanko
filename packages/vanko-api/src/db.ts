import pg from "pg";
import { Kysely, PostgresDialect } from "kysely";
import { UserTable } from "@/models/types/user.ts";

interface Database {
    user: UserTable;
}

const dialect = new PostgresDialect({
    pool: new pg.Pool({
        database: process.env.POSTGRES_DB,
        host: process.env.POSTGRES_HOST,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        port: Number(process.env.POSTGRES_PORT),
        max: 10
    })
});

const db = new Kysely<Database>({
    dialect
});

export default db;
