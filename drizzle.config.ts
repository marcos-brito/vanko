import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/lib/schema/index.ts",
    out: "./drizzle",
    dbCredentials: {
        url: process.env.DATABASE_URL
    }
});
