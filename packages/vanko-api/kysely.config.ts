import "dotenv/config";
import { Pool } from "pg";
import { defineConfig } from "kysely-ctl";

export default defineConfig({
    dialect: "pg",
    dialectConfig: {
        pool: new Pool({
            database: process.env.POSTGRES_DB,
            host: process.env.POSTGRES_HOST,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            port: Number(process.env.POSTGRES_PORT),
            max: 1
        })
    },
    migrations: {
        migrationFolder: "migrations",
        getMigrationPrefix: () => `${new Date().toISOString()}_`
    },
    seeds: {
        seedFolder: "seeds",
        getSeedPrefix: () => ``
    }
});
