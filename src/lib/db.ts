import { SERVICE_SUPABASE_ANON_KEY } from "$env/static/private";
import { PUBLIC_SUPABASE_URL } from "$env/static/public";
import { createClient } from "@supabase/supabase-js";
import { createClient as createRedisClient } from "redis";
import { DATABASE_URL } from "$env/static/private";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as models from "$lib/models";

export const client = postgres(DATABASE_URL, { prepare: false });
export const db = drizzle(client, { schema: models });
export const supabase = createClient(
    PUBLIC_SUPABASE_URL,
    SERVICE_SUPABASE_ANON_KEY
);
export const redis = await createRedisClient()
    .on("error", (err) => console.log(err))
    .connect();
