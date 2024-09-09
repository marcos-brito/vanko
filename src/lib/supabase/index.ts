import { SERVICE_SUPABASE_ANON_KEY } from "$env/static/private";
import { PUBLIC_SUPABASE_URL } from "$env/static/public";
import { createClient } from "@supabase/supabase-js";
import { type Database } from "./database.types";

export const supabase = createClient<Database>(
    PUBLIC_SUPABASE_URL,
    SERVICE_SUPABASE_ANON_KEY
);
