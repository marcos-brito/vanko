import pg, { PoolConfig } from "pg";
import { Kysely, PostgresDialect, sql } from "kysely";
import { UserTable } from "@/models/types/user.ts";
import logger from "./logger.ts";

const db = createConnection(defaultConfig());
export interface Database {
    users: UserTable;
}

export function createConnection(config: PoolConfig): Kysely<Database> {
    console.log(config);
    const dialect = new PostgresDialect({
        pool: new pg.Pool(config)
    });

    return new Kysely<Database>({ dialect });
}

export function defaultConfig(): PoolConfig {
    return {
        database: process.env.POSTGRES_DB,
        host: process.env.POSTGRES_HOST,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        port: Number(process.env.POSTGRES_PORT),
        max: 10
    };
}

export async function pingDatabase() {
    try {
        await sql`SELECT 1`.execute(db);
        logger.info(
            `Connected to database at ${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}`
        );
    } catch (e) {
        logger.error("Connection to database failed", e);
    }
}

export default db;
