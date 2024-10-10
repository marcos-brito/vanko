import { db } from "$lib/db";
import { profiles } from "$lib/schema";
import { eq } from "drizzle-orm";
import { type Profile } from "./types";

export async function findUserProfile(
    id: string
): Promise<Profile | undefined> {
    return await db.query.profiles.findFirst({
        where: eq(profiles.id, id)
    });
}
