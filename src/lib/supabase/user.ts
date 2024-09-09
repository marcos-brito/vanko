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

    if (err) return null;

    const result = await findUserProfile(user!.id);

    return result;
}

export async function verifyCurrentUserPassword(
    supabaseClient: SupabaseClient,
    password: string
): Promise<Result<boolean>> {
    const { data, error } = await supabaseClient.auth.getUser();
    if (error) return null;

    const matches = await UserPasswordMatch(data.user.id, password);

    return matches;
}

async function UserPasswordMatch(
    userId: string,
    password: string
): Promise<Result<boolean>> {
    const { data: matches, error } = await supabase.rpc(
        "verify_user_password",
        {
            user_id: userId,
            password
        }
    );

    if (error) {
        return null;
    }

    return matches;
}
