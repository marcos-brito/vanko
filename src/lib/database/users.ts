import type { SupabaseClient } from "@supabase/supabase-js";
import { db, supabase } from "./index";
import { profiles, addresses, type Profile } from "./schema";
import { eq } from "drizzle-orm";

export async function findUserProfile(
    supabase: SupabaseClient
): Promise<Profile | undefined> {
    const { data } = await supabase.auth.getUser();

    if (!data.user) return undefined;

    return await db.query.profiles.findFirst({
        where: eq(profiles.id, data.user.id)
    });
}

export async function findUserAddresses(userId: string) {
    return await db.query.addresses.findMany({
        columns: {
            user: false
        },
        with: {
            country: {
                columns: {
                    name: true
                }
            },
            state: {
                columns: {
                    name: true
                }
            }
        },
        where: eq(addresses.user, userId)
    });
}

export async function verifyUserPassword(
    supabaseClient: SupabaseClient,
    password: string
): Promise<boolean | undefined> {
    const { data: userData } = await supabaseClient.auth.getUser();
    if (!userData.user) return undefined;

    const { data } = await supabase.rpc("verify_user_password", {
        user_id: userData.user.id,
        password
    });

    return data || undefined;
}
