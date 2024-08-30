import pg from "pg";
import { Kysely, PostgresDialect, sql } from "kysely";
import { UserTable } from "@/models/types/user.ts";
import logger from "./logger.ts";

interface Database {
    users: UserTable;
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

export function pingDatabase() {
    try {
        sql`SELECT 1`.execute(db);
        logger.info(
            `Connected to database at ${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}`
        );
    } catch (e) {
        logger.error("Connection to database failed", e);
    }
}

export default db;
