import { supabase } from "$lib/db";

export async function verifyUserPassword(
    id: string,
    password: string
): Promise<boolean | undefined> {
    const { data, error } = await supabase.rpc("verify_user_password", {
        user_id: id,
        password
    });

    if (error) return undefined;

    return data;
}
