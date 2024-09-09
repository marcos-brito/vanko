import { type Tables } from "./database.types";
import { supabase } from "./index";

export async function findUserProfile(id: string): Promise<Tables<"profiles">> {
    const { data: profile, error } = await supabase
        .from("profiles")
        .select()
        .eq("id", id)
        .single();

    if (!profile) {
        console.log("should do something about: ", error);
    }

    return profile!;
}
