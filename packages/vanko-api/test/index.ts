import "dotenv/config";
import path from "path";
import {
    DockerComposeEnvironment,
    StartedDockerComposeEnvironment,
    Wait
} from "testcontainers";
import { promises as fs } from "fs";
import { Kysely, Migrator, FileMigrationProvider } from "kysely";
import { createConnection, Database, defaultConfig } from "@/db.ts";
import Koa from "koa";
import { init } from "@/index.ts";
import supertest from "supertest";
import TestAgent from "supertest/lib/agent.js";

export class App {
    private app = new Koa();
    req: TestAgent | undefined;
    env: StartedDockerComposeEnvironment | undefined;
    db: Kysely<Database> | undefined;

    async initialize() {
        init(this.app);

        this.env = await createEnv();
        this.db = createConnection(defaultConfig());
        this.req = supertest(this.app.callback());

        await runMigrations(this.db);
    }

    async destroy() {
        this.db?.destroy();
        this.env?.down();
    }
}

async function createEnv(): Promise<StartedDockerComposeEnvironment> {
    return new DockerComposeEnvironment(path.join("./"), "docker-compose.yml")
        .withEnvironment({
            POSTGRES_PORT: "5432"
        })
        .withWaitStrategy(
            "db-1",
            Wait.forLogMessage(
                /.*database system is ready to accept connections.*/,
                2
            )
        )
        .up();
}

async function runMigrations(db: Kysely<any>) {
    const migrator = new Migrator({
        db,
        provider: new FileMigrationProvider({
            fs,
            path,
            migrationFolder: path.join(__dirname, "../migrations")
        })
    });

    const { error } = await migrator.migrateToLatest();

    if (error) {
        console.error(error);
    }
}
