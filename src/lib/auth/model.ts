import { supabase } from "$lib/db";

export async function verifyUserPassword(
    id: string,
    password: string
): Promise<boolean | undefined> {
    const { data } = await supabase.rpc("verify_user_password", {
        user_id: id,
        password
    });

    if (!data) {
        throw new Error({ message });
    }
}
