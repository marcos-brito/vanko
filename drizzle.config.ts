import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/lib/database/schema/index.ts",
    out: "./drizzle",
    dbCredentials: {
        url: process.env.DATABASE_URL
    }
});
