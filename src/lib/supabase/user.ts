import type { SupabaseClient } from "@supabase/supabase-js";
import { type Tables } from "./database.types";
import { supabase } from "./index";

export type Result<T> = T | null;

export async function findUserProfile(
    id: string
): Promise<Result<Tables<"profiles">>> {
    const { data: profile, error } = await supabase
        .from("profiles")
        .select()
        .eq("id", id)
        .single();

    if (error) {
        return null;
    }

    return profile;
}

export async function findCurrentUserProfile(
    supabase: SupabaseClient
): Promise<Result<Tables<"profiles">>> {
    const {
        error: err,
        data: { user }
    } = await supabase.auth.getUser();

    if (err) {
        return null;
    }

    const result = await findUserProfile(user!.id);
    if (!result) {
        return null;
    }

    return result;
}
